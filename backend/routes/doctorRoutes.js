const express = require('express');
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  updateDoctorStatus,
} = require('../controllers/doctorController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/doctors
 * @desc    Get all doctors list
 * @access  Public
 */
router.get('/', getAllDoctors);

/**
 * @route   PATCH /api/doctors/status
 * @desc    Update doctor availability status
 * @access  Private (Doctor only)
 * @note    Must be defined before /:id to prevent 'status' from being parsed as an ID parameter
 */
router.patch('/status', protect, authorizeRoles('doctor'), updateDoctorStatus);

/**
 * @route   GET /api/doctors/:id
 * @desc    Get doctor details by ID
 * @access  Public
 */
router.get('/:id', getDoctorById);

module.exports = router;
