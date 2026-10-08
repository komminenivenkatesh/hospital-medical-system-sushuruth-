const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');

// Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const registerUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      specialty,
      experienceYears,
      consultationFee,
      licenseNumber,
      hospital,
      hospitalName,
      hospitalType,
      city,
      address,
      totalBeds,
      facilities
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'patient',
      phone: phone || ''
    });

    let doctorProfile = null;
    let hospitalProfile = null;

    if (user.role === 'doctor') {
      doctorProfile = await Doctor.create({
        user: user._id,
        specialty: specialty || 'General Physician',
        experienceYears: experienceYears ? Number(experienceYears) : 0,
        consultationFee: consultationFee ? Number(consultationFee) : 500,
        licenseNumber: licenseNumber || '',
        hospital: hospital || '',
        verificationStatus: 'Pending',
        availableToday: false,
        status: 'Offline'
      });
    } else if (user.role === 'hospital') {
      hospitalProfile = await Hospital.create({
        user: user._id,
        name: hospitalName || name,
        type: hospitalType || 'Multi-Specialty',
        licenseNumber: licenseNumber || '',
        city: city || 'Hyderabad, Telangana',
        address: address || '',
        totalBeds: totalBeds ? Number(totalBeds) : 150,
        availableBeds: totalBeds ? Math.round(Number(totalBeds) * 0.25) : 35,
        facilities: Array.isArray(facilities) && facilities.length ? facilities : ['24/7 Emergency', 'ICU Facilities', 'Advanced MRI', 'In-house Pharmacy', 'Blood Bank'],
        verificationStatus: 'Pending'
      });
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan,
      doctorProfile,
      hospitalProfile,
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (user && (await user.matchPassword(password))) {
      let doctorProfile = null;
      let hospitalProfile = null;

      if (user.role === 'doctor') {
        doctorProfile = await Doctor.findOne({ user: user._id });
      } else if (user.role === 'hospital') {
        hospitalProfile = await Hospital.findOne({ user: user._id });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        avatar: user.avatar,
        doctorProfile,
        hospitalProfile,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    let user = req.user;
    let data = { ...user.toObject() };
    
    if (user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ user: user._id });
      data.doctorProfile = doctorProfile;
    } else if (user.role === 'hospital') {
      const hospitalProfile = await Hospital.findOne({ user: user._id });
      data.hospitalProfile = hospitalProfile;
    }
    
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  generateToken
};
