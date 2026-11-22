const express = require('express');
const router = express.Router();
const {
  getPrescriptions,
  createPrescription,
  getLabReports,
  createLabReport,
  getHealthSummary,
} = require('../controllers/healthController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/health/summary
 * @desc    Get aggregate health records statistics
 * @access  Private
 */
router.get('/summary', protect, getHealthSummary);

/**
 * @route   GET /api/health/prescriptions
 * @desc    Get prescriptions for logged in user
 * @access  Private
 */
router.get('/prescriptions', protect, getPrescriptions);

/**
 * @route   POST /api/health/prescriptions
 * @desc    Create new prescription
 * @access  Private
 */
router.post('/prescriptions', protect, createPrescription);

/**
 * @route   GET /api/health/lab-reports
 * @desc    Get lab reports for patient
 * @access  Private
 */
router.get('/lab-reports', protect, getLabReports);

/**
 * @route   POST /api/health/lab-reports
 * @desc    Create new lab report
 * @access  Private
 */
router.post('/lab-reports', protect, createLabReport);

module.exports = router;
