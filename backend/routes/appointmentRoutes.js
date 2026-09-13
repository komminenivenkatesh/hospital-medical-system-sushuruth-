const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getAppointments,
  updateAppointmentStatus,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

// Protect all appointment routes
router.use(protect);

/**
 * @route   POST /api/appointments
 * @desc    Book a new appointment
 * @access  Private
 */
router.post('/', bookAppointment);

/**
 * @route   GET /api/appointments
 * @desc    Get user's appointments (patient or doctor)
 * @access  Private
 */
router.get('/', getAppointments);

/**
 * @route   PATCH /api/appointments/:id/status
 * @desc    Update appointment status (confirm, cancel, complete)
 * @access  Private
 */
router.patch('/:id/status', updateAppointmentStatus);

module.exports = router;
