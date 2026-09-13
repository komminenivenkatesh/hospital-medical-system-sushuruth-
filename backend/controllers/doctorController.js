const Doctor = require('../models/Doctor');
const User = require('../models/User');

const getAllDoctors = async (req, res, next) => {
  try {
    const { specialty, status, availableToday } = req.query;
    
    const filter = {};
    if (specialty) filter.specialty = specialty;
    if (status) filter.status = status;
    if (availableToday !== undefined) filter.availableToday = availableToday === 'true';

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

module.exports = {
  getAllDoctors,
  getDoctorById,
  updateDoctorStatus
};
