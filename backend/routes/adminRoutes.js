const express = require('express');
const router = express.Router();
const {
  getAdminOverview,
  getAdminAnalytics,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/admin/overview
 * @desc    Get administrative dashboard statistics
 * @access  Private (Admin / Authenticated)
 */
router.get('/overview', protect, getAdminOverview);

/**
 * @route   GET /api/admin/analytics
 * @desc    Get user growth and engagement analytics
 * @access  Private (Admin / Authenticated)
 */
router.get('/analytics', protect, getAdminAnalytics);

module.exports = router;
