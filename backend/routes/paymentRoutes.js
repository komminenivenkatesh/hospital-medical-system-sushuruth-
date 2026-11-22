const express = require('express');
const router = express.Router();
const {
  getPaymentHistory,
  createPayment,
  getDoctorEarnings,
} = require('../controllers/paymentController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/payments/history
 * @desc    Get patient payments and transaction ledger
 * @access  Private
 */
router.get('/history', protect, getPaymentHistory);

/**
 * @route   POST /api/payments
 * @desc    Record a new payment transaction
 * @access  Private
 */
router.post('/', protect, createPayment);

/**
 * @route   GET /api/payments/doctor/earnings
 * @desc    Get doctor revenue breakdown, charts and payout list
 * @access  Private (Doctor only)
 */
router.get('/doctor/earnings', protect, authorizeRoles('doctor'), getDoctorEarnings);

module.exports = router;
