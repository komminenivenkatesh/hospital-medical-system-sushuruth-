const Doctor = require('../models/Doctor');
const User = require('../models/User');

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

module.exports = {
  getAllDoctors,
  getDoctorById,
  updateDoctorStatus,
  getVerifications,
  updateVerificationStatus
};
