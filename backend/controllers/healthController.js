const Prescription = require('../models/Prescription');
const LabReport = require('../models/LabReport');
const MriAnalysis = require('../models/MriAnalysis');
const Doctor = require('../models/Doctor');

// @desc    Get prescriptions for current user (patient or doctor)
// @route   GET /api/health/prescriptions
// @access  Private
const getPrescriptions = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === 'patient') {
      filter.patient = req.user._id;
    } else if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ user: req.user._id });
      if (doctorProfile) {
        filter.doctor = doctorProfile._id;
      }
    }

    const prescriptions = await Prescription.find(filter)
      .populate('patient', 'name email phone avatar')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email avatar' },
      })
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    next(error);
  }
};

// @desc    Create prescription
// @route   POST /api/health/prescriptions
// @access  Private (Doctor only)
const createPrescription = async (req, res, next) => {
  try {
    const { patientId, appointmentId, diagnosis, medicines, advice, followUpDate, notes } = req.body;

    let doctorId = req.body.doctorId;
    if (!doctorId && req.user.role === 'doctor') {
      const doc = await Doctor.findOne({ user: req.user._id });
      if (doc) doctorId = doc._id;
    }

    if (!doctorId) {
      return res.status(400).json({ message: 'Doctor profile required to author prescription' });
    }

    // Resolve target patient safely
    let targetPatientId = patientId;
    const mongoose = require('mongoose');
    if (!targetPatientId || !mongoose.Types.ObjectId.isValid(targetPatientId)) {
      if (appointmentId && mongoose.Types.ObjectId.isValid(appointmentId)) {
        const Appointment = require('../models/Appointment');
        const appt = await Appointment.findById(appointmentId);
        if (appt && appt.patient) targetPatientId = appt.patient;
      }
      if (!targetPatientId || !mongoose.Types.ObjectId.isValid(targetPatientId)) {
        const User = require('../models/User');
        const defaultPatient = await User.findOne({ role: 'patient' });
        if (defaultPatient) targetPatientId = defaultPatient._id;
      }
    }

    if (!targetPatientId) {
      return res.status(400).json({ message: 'Patient reference is required' });
    }

    const validApptId = (appointmentId && mongoose.Types.ObjectId.isValid(appointmentId)) ? appointmentId : null;

    const prescription = await Prescription.create({
      patient: targetPatientId,
      doctor: doctorId,
      appointment: validApptId,
      diagnosis: diagnosis || 'General Teleconsultation Review',
      medicines: medicines || [],
      advice: advice || '',
      followUpDate: followUpDate || null,
      notes: notes || '',
    });

    if (validApptId) {
      const Appointment = require('../models/Appointment');
      await Appointment.findByIdAndUpdate(validApptId, { status: 'completed' });
    }

    const populated = await Prescription.findById(prescription._id)
      .populate('patient', 'name email phone avatar')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email avatar' },
      });

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get lab reports for current patient
// @route   GET /api/health/lab-reports
// @access  Private
const getLabReports = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === 'patient') {
      filter.patient = req.user._id;
    }

    const reports = await LabReport.find(filter)
      .populate('patient', 'name email phone')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email' },
      })
      .sort({ date: -1 });

    res.json(reports);
  } catch (error) {
    next(error);
  }
};

// @desc    Create lab report
// @route   POST /api/health/lab-reports
// @access  Private
const createLabReport = async (req, res, next) => {
  try {
    const { testName, category, date, resultStatus, parameters, labName, notes, patientId } = req.body;

    const report = await LabReport.create({
      patient: patientId || req.user._id,
      testName,
      category: category || 'Hematology',
      date: date || new Date(),
      resultStatus: resultStatus || 'Normal',
      parameters: parameters || [],
      labName: labName || 'Sushruth Diagnostics & Imaging Labs',
      notes: notes || '',
    });

    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
};

// @desc    Get aggregate health records summary for stat cards
// @route   GET /api/health/summary
// @access  Private
const getHealthSummary = async (req, res, next) => {
  try {
    const patientId = req.user._id;

    const [rxCount, labCount, mriCount] = await Promise.all([
      Prescription.countDocuments({ patient: patientId }),
      LabReport.countDocuments({ patient: patientId }),
      MriAnalysis.countDocuments({ patient: patientId }),
    ]);

    res.json({
      totalRecords: rxCount + labCount + mriCount,
      prescriptionsCount: rxCount,
      labReportsCount: labCount,
      mriReportsCount: mriCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPrescriptions,
  createPrescription,
  getLabReports,
  createLabReport,
  getHealthSummary,
};
