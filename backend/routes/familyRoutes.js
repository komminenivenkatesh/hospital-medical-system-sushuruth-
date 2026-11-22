const express = require('express');
const router = express.Router();
const {
  getFamilyMembers,
  addFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
} = require('../controllers/familyController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/family
 * @desc    Get all family members for user
 * @access  Private
 */
router.get('/', protect, getFamilyMembers);

/**
 * @route   POST /api/family
 * @desc    Add family member
 * @access  Private
 */
router.post('/', protect, addFamilyMember);

/**
 * @route   PUT /api/family/:id
 * @desc    Update family member
 * @access  Private
 */
router.put('/:id', protect, updateFamilyMember);

/**
 * @route   DELETE /api/family/:id
 * @desc    Delete family member
 * @access  Private
 */
router.delete('/:id', protect, deleteFamilyMember);

module.exports = router;
