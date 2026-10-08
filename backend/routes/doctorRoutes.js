const express = require('express');
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  updateDoctorStatus,
  getVerifications,
  updateVerificationStatus,
} = require('../controllers/doctorController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/doctors
 * @desc    Get all doctors list
 * @access  Public
 */
router.get('/', getAllDoctors);

/**
 * @route   GET /api/doctors/verifications
 * @desc    Get all doctors for verification
 * @access  Private (Admin / Authenticated)
 */
router.get('/verifications', protect, getVerifications);

/**
 * @route   PATCH /api/doctors/status
 * @desc    Update doctor availability status
 * @access  Private (Doctor only)
 * @note    Must be defined before /:id to prevent 'status' from being parsed as an ID parameter
 */
router.patch('/status', protect, authorizeRoles('doctor'), updateDoctorStatus);

/**
 * @route   PATCH /api/doctors/:id/verify
 * @desc    Update doctor verification status (Approve / Reject)
 * @access  Private (Admin only or authenticated)
 */
router.patch('/:id/verify', protect, updateVerificationStatus);

/**
 * @route   GET /api/doctors/:id
 * @desc    Get doctor details by ID
 * @access  Public
 */
router.get('/:id', getDoctorById);

module.exports = router;
