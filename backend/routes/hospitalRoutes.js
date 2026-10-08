const express = require('express');
const router = express.Router();
const {
  getAllHospitals,
  getHospitalById,
  getHospitalVerifications,
  updateHospitalVerification,
  updateMyHospital
} = require('../controllers/hospitalController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/hospitals
 * @desc    Get all verified hospitals list
 * @access  Public
 */
router.get('/', getAllHospitals);

/**
 * @route   GET /api/hospitals/verifications
 * @desc    Get all hospitals for verification queue
 * @access  Private (Admin / Authenticated)
 */
router.get('/verifications', protect, getHospitalVerifications);

/**
 * @route   PATCH /api/hospitals/me
 * @desc    Update hospital facility details by hospital admin
 * @access  Private (Hospital)
 */
router.patch('/me', protect, updateMyHospital);

/**
 * @route   PATCH /api/hospitals/:id/verify
 * @desc    Approve or reject hospital verification
 * @access  Private (Admin)
 */
router.patch('/:id/verify', protect, updateHospitalVerification);

/**
 * @route   GET /api/hospitals/:id
 * @desc    Get hospital details by ID
 * @access  Public
 */
router.get('/:id', getHospitalById);

module.exports = router;
