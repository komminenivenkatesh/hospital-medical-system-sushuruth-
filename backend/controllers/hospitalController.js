const Hospital = require('../models/Hospital');
const User = require('../models/User');

const getAllHospitals = async (req, res, next) => {
  try {
    const { city, type, verificationStatus, all } = req.query;

    const filter = {};
    if (city) filter.city = new RegExp(city, 'i');
    if (type) filter.type = type;

    if (verificationStatus && verificationStatus !== 'All') {
      filter.verificationStatus = verificationStatus;
    } else if (!all) {
      filter.verificationStatus = 'Approved';
    }

    const hospitals = await Hospital.find(filter).populate('user', 'name email phone avatar');
    res.json(hospitals);
  } catch (error) {
    next(error);
  }
};

const getHospitalById = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id).populate('user', 'name email phone avatar');

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.json(hospital);
  } catch (error) {
    next(error);
  }
};

const getHospitalVerifications = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'All') {
      filter.verificationStatus = status;
    }

    const hospitals = await Hospital.find(filter)
      .populate('user', 'name email phone avatar createdAt')
      .sort({ createdAt: -1 });

    res.json(hospitals);
  } catch (error) {
    next(error);
  }
};

const updateHospitalVerification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { verificationStatus } = req.body;

    if (!['Pending', 'Approved', 'Rejected'].includes(verificationStatus)) {
      return res.status(400).json({ message: 'Invalid verification status' });
    }

    const hospital = await Hospital.findById(id).populate('user', 'name email phone');
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    hospital.verificationStatus = verificationStatus;
    await hospital.save();

    res.json(hospital);
  } catch (error) {
    next(error);
  }
};

const updateMyHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findOne({ user: req.user._id });
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital profile not found' });
    }

    const { totalBeds, availableBeds, waitMinutes, facilities, address } = req.body;
    if (totalBeds !== undefined) hospital.totalBeds = Number(totalBeds);
    if (availableBeds !== undefined) hospital.availableBeds = Number(availableBeds);
    if (waitMinutes !== undefined) hospital.waitMinutes = Number(waitMinutes);
    if (facilities !== undefined) hospital.facilities = facilities;
    if (address !== undefined) hospital.address = address;

    await hospital.save();
    res.json(hospital);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllHospitals,
  getHospitalById,
  getHospitalVerifications,
  updateHospitalVerification,
  updateMyHospital
};
