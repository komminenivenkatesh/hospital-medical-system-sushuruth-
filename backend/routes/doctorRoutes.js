const express = require('express');
const router = express.Router();
const {
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
 * @route   GET /api/doctors/my/profile
 * @desc    Get profile of the currently logged in doctor
 * @access  Private (Doctor only)
 */
router.get('/my/profile', protect, authorizeRoles('doctor'), getMyDoctorProfile);

/**
 * @route   PUT /api/doctors/my/profile
 * @desc    Update profile of the currently logged in doctor
 * @access  Private (Doctor only)
 */
router.put('/my/profile', protect, authorizeRoles('doctor'), updateMyDoctorProfile);

/**
 * @route   GET /api/doctors/my/availability
 * @desc    Get availability schedule of the currently logged in doctor
 * @access  Private (Doctor only)
 */
router.get('/my/availability', protect, authorizeRoles('doctor'), getMyAvailability);

/**
 * @route   PUT /api/doctors/my/availability
 * @desc    Update availability schedule of the currently logged in doctor
 * @access  Private (Doctor only)
 */
router.put('/my/availability', protect, authorizeRoles('doctor'), updateMyAvailability);

/**
 * @route   GET /api/doctors/my/patients
 * @desc    Get all assigned patients for the logged in doctor
 * @access  Private (Doctor only)
 */
router.get('/my/patients', protect, authorizeRoles('doctor'), getDoctorPatients);

/**
 * @route   GET /api/doctors/my/dashboard-stats
 * @desc    Get dashboard metrics & queue for the logged in doctor
 * @access  Private (Doctor only)
 */
router.get('/my/dashboard-stats', protect, authorizeRoles('doctor'), getDoctorDashboardStats);

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
