const Transaction = require('../models/Transaction');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const mongoose = require('mongoose');

// Default user payment methods if none stored yet
const DEFAULT_PAYMENT_METHODS = [
  { id: 'pm1', type: 'UPI', label: 'meera@okicici', primary: true },
  { id: 'pm2', type: 'Card', label: '•••• •••• •••• 4523', primary: false },
  { id: 'pm3', type: 'Wallet', label: 'Sushruth Wallet — ₹1,240', primary: false },
];

/**
 * @desc    Get patient transaction history & payment stats
 * @route   GET /api/payments/history
 * @access  Private (Patient / All Authenticated)
 */
const getPaymentHistory = async (req, res, next) => {
  try {
    const patientId = req.user._id;

    const transactions = await Transaction.find({ patient: patientId })
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email avatar' },
      })
      .populate('appointment')
      .sort({ createdAt: -1 });

    const totalSpent = transactions
      .filter((t) => t.status !== 'Refunded')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const activeCount = transactions.filter((t) => t.status === 'Completed' || t.status === 'Auto-renewed').length;

    res.json({
      transactions: transactions.map((t) => {
        const doctorName = t.doctor?.user?.name || (t.type === 'Subscription' || t.type === 'Monthly Plan' ? 'Sushruth Pro' : 'Medical Specialist');
        const specialty = t.specialty || t.doctor?.specialty || (t.type === 'Subscription' ? 'Platform Subscription' : 'General Medicine');
        const dateStr = t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent';
        const timeStr = t.createdAt ? new Date(t.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '';

        return {
          id: t._id,
          doctor: doctorName,
          specialty,
          type: t.type,
          amount: t.amount,
          date: dateStr,
          time: timeStr,
          status: t.status,
          method: t.method,
          methodDetails: t.methodDetails,
          invoiceNumber: t.invoiceNumber,
        };
      }),
      summary: {
        totalSpent,
        totalCount: transactions.length,
        activeCount,
      },
      paymentMethods: DEFAULT_PAYMENT_METHODS,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create / record payment transaction
 * @route   POST /api/payments
 * @access  Private
 */
const createPayment = async (req, res, next) => {
  try {
    const { doctorId, appointmentId, amount, type, method, methodDetails, specialty, title } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid payment amount is required' });
    }

    let validDocId = null;
    let resolvedSpecialty = specialty || 'General Medicine';

    if (doctorId && mongoose.Types.ObjectId.isValid(doctorId)) {
      validDocId = doctorId;
      const doc = await Doctor.findById(doctorId);
      if (doc && doc.specialty) resolvedSpecialty = doc.specialty;
    }

    const transaction = await Transaction.create({
      patient: req.user._id,
      doctor: validDocId,
      appointment: (appointmentId && mongoose.Types.ObjectId.isValid(appointmentId)) ? appointmentId : null,
      title: title || (type ? `${type} Fee` : 'Consultation Fee'),
      amount,
      type: type || 'Video Consultation',
      specialty: resolvedSpecialty,
      status: 'Completed',
      method: method || 'UPI',
      methodDetails: methodDetails || (method === 'UPI' ? `${req.user.name?.toLowerCase().replace(/\s+/g, '')}@okaxis` : 'Online Payment'),
    });

    // If linked to an appointment, mark it confirmed/paid
    if (appointmentId && mongoose.Types.ObjectId.isValid(appointmentId)) {
      await Appointment.findByIdAndUpdate(appointmentId, { status: 'confirmed' });
    }

    const populated = await Transaction.findById(transaction._id)
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email avatar' },
      });

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get doctor revenue, earnings metrics, and payout ledger
 * @route   GET /api/payments/doctor/earnings
 * @access  Private (Doctor only)
 */
const getDoctorEarnings = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const transactions = await Transaction.find({ doctor: doctor._id })
      .populate('patient', 'name email phone avatar')
      .sort({ createdAt: -1 });

    const gross = transactions.reduce((sum, t) => sum + (t.doctorGross || t.amount || 0), 0);
    const commission = transactions.reduce((sum, t) => sum + (t.platformCommission || 0), 0);
    const tds = transactions.reduce((sum, t) => sum + (t.tds || 0), 0);
    const net = gross - commission - tds;

    // Monthly revenue aggregation
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap = new Map();

    // Seed recent 6 months with defaults or real records
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mName = monthNames[d.getMonth()];
      monthlyMap.set(mName, { month: mName, clinic: 0, video: 0, mri: 0 });
    }

    transactions.forEach((t) => {
      const tMonth = monthNames[new Date(t.createdAt).getMonth()];
      if (monthlyMap.has(tMonth)) {
        const item = monthlyMap.get(tMonth);
        if (t.type === 'In-Clinic Visit') item.clinic += t.amount;
        else if (t.type === 'MRI Review') item.mri += t.amount;
        else item.video += t.amount;
      }
    });

    const monthlyData = Array.from(monthlyMap.values());

    const formattedTxns = transactions.map((t) => {
      const patientName = t.patient?.name
        ? t.patient.name.split(' ').map((w) => w[0] + '*'.repeat(Math.max(1, w.length - 2)) + (w.length > 1 ? w[w.length - 1] : '')).join(' ')
        : 'Patient M.';
      const dateStr = t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recent';

      return {
        id: t._id,
        date: dateStr,
        patient: patientName,
        type: t.type === 'In-Clinic Visit' ? 'In-Clinic' : (t.type === 'MRI Review' ? 'MRI Review' : 'Video'),
        gross: t.doctorGross || t.amount,
        commission: t.platformCommission || Math.round(t.amount * 0.15),
        net: t.doctorNet || Math.round(t.amount * 0.8),
      };
    });

    res.json({
      metrics: {
        gross: `₹${gross.toLocaleString('en-IN')}`,
        commission: `₹${commission.toLocaleString('en-IN')}`,
        tds: `₹${tds.toLocaleString('en-IN')}`,
        netPayout: `₹${net.toLocaleString('en-IN')}`,
        statusText: 'Paid',
        statusColor: '#10B981',
      },
      monthly: monthlyData,
      transactions: formattedTxns,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPaymentHistory,
  createPayment,
  getDoctorEarnings,
};
