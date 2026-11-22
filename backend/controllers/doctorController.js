const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');

const getAllDoctors = async (req, res, next) => {
  try {
    const { specialty, status, availableToday, verificationStatus, all } = req.query;
    
    const filter = {};
    if (specialty) filter.specialty = specialty;
    if (status) filter.status = status;
    if (availableToday !== undefined) filter.availableToday = availableToday === 'true';
    
    // Unless requested with all=true or specific verificationStatus, show only approved doctors
    if (verificationStatus && verificationStatus !== 'All') {
      filter.verificationStatus = verificationStatus;
    } else if (!all) {
      filter.verificationStatus = 'Approved';
    }

    const doctors = await Doctor.find(filter).populate('user', 'name email avatar phone');
    res.json(doctors);
  } catch (error) {
    next(error);
  }
};

const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email avatar phone');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

const updateDoctorStatus = async (req, res, next) => {
  try {
    const { status, availableToday } = req.body;
    
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    
    if (status) doctor.status = status;
    if (availableToday !== undefined) doctor.availableToday = availableToday;
    
    await doctor.save();
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

const getVerifications = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'All') {
      filter.verificationStatus = status;
    }
    const doctors = await Doctor.find(filter)
      .populate('user', 'name email phone avatar createdAt')
      .sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    next(error);
  }
};

const updateVerificationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { verificationStatus } = req.body;

    if (!['Pending', 'Approved', 'Rejected'].includes(verificationStatus)) {
      return res.status(400).json({ message: 'Invalid verification status' });
    }

    const doctor = await Doctor.findById(id).populate('user', 'name email phone avatar');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.verificationStatus = verificationStatus;
    if (verificationStatus === 'Approved') {
      doctor.availableToday = true;
      doctor.status = 'Available';
    } else {
      doctor.availableToday = false;
      doctor.status = 'Offline';
    }

    await doctor.save();
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

const getDoctorPatients = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    // Find all appointments for this doctor
    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate('patient', 'name email phone avatar')
      .sort({ date: -1 });

    // Group by unique patient
    const patientMap = new Map();
    for (const appt of appointments) {
      if (!appt.patient) continue;
      const pId = appt.patient._id.toString();
      if (!patientMap.has(pId)) {
        patientMap.set(pId, {
          id: pId,
          name: appt.patient.name,
          email: appt.patient.email,
          phone: appt.patient.phone || '',
          avatar: appt.patient.avatar || '',
          doctor: req.user.name,
          condition: appt.reason || 'General Consultation',
          lastAppointment: appt.date,
          status: appt.status,
          totalAppointments: 1,
        });
      } else {
        const existing = patientMap.get(pId);
        existing.totalAppointments += 1;
      }
    }

    res.json(Array.from(patientMap.values()));
  } catch (error) {
    next(error);
  }
};

const getDoctorDashboardStats = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const [todayAppointments, totalAppointments, pendingRx] = await Promise.all([
      Appointment.find({
        doctor: doctor._id,
        date: { $gte: startOfToday, $lte: endOfToday },
      }).populate('patient', 'name email phone avatar').sort({ slot: 1 }),
      Appointment.countDocuments({ doctor: doctor._id }),
      Prescription.countDocuments({ doctor: doctor._id, status: 'Active' }),
    ]);

    const queue = todayAppointments.map((a, idx) => ({
      id: a._id,
      time: a.slot || '10:00 AM',
      name: a.patient?.name || 'Patient',
      type: a.type === 'video' ? 'Video' : 'In-Clinic',
      status: a.status,
      current: idx === 0,
      reason: a.reason,
    }));

    res.json({
      todayCount: todayAppointments.length,
      totalCount: totalAppointments,
      pendingActions: pendingRx,
      rating: doctor.rating || 4.8,
      consultationFee: doctor.consultationFee || 500,
      queue,
    });
  } catch (error) {
    next(error);
  }
};

const getMyDoctorProfile = async (req, res, next) => {
  try {
    let doctor = await Doctor.findOne({ user: req.user._id }).populate('user', 'name email phone avatar');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

const updateMyDoctorProfile = async (req, res, next) => {
  try {
    const { name, phone, specialty, hospital, experienceYears, consultationFee, videoFee, bio, languages } = req.body;
    let doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    if (specialty !== undefined) doctor.specialty = specialty;
    if (hospital !== undefined) doctor.hospital = hospital;
    if (experienceYears !== undefined) doctor.experienceYears = Number(experienceYears);
    if (consultationFee !== undefined) doctor.consultationFee = Number(consultationFee);
    if (videoFee !== undefined) doctor.videoFee = Number(videoFee);
    if (bio !== undefined) doctor.bio = bio;
    if (Array.isArray(languages)) doctor.languages = languages;

    await doctor.save();

    if (name || phone) {
      const user = await User.findById(req.user._id);
      if (user) {
        if (name) user.name = name;
        if (phone) user.phone = phone;
        await user.save();
      }
    }

    const updated = await Doctor.findById(doctor._id).populate('user', 'name email phone avatar');
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const getMyAvailability = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    res.json({
      weeklySchedule: doctor.weeklySchedule || {},
      slotDuration: doctor.slotDuration || '20min',
      blockedDates: doctor.blockedDates || [],
      availableToday: doctor.availableToday,
      status: doctor.status
    });
  } catch (error) {
    next(error);
  }
};

const updateMyAvailability = async (req, res, next) => {
  try {
    const { weeklySchedule, slotDuration, blockedDates, availableToday, status } = req.body;
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    if (weeklySchedule) doctor.weeklySchedule = weeklySchedule;
    if (slotDuration) doctor.slotDuration = slotDuration;
    if (blockedDates) doctor.blockedDates = blockedDates;
    if (availableToday !== undefined) doctor.availableToday = availableToday;
    if (status) doctor.status = status;

    await doctor.save();
    res.json({
      message: 'Availability updated successfully',
      weeklySchedule: doctor.weeklySchedule,
      slotDuration: doctor.slotDuration,
      blockedDates: doctor.blockedDates,
      availableToday: doctor.availableToday,
      status: doctor.status
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  updateDoctorStatus,
  getVerifications,
  updateVerificationStatus,
  getDoctorPatients,
  getDoctorDashboardStats,
  getMyDoctorProfile,
  updateMyDoctorProfile,
  getMyAvailability,
  updateMyAvailability,
};
