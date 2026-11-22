const express = require('express');
const router = express.Router();
const {
  getArticles,
  getArticleById,
  createArticle,
} = require('../controllers/articleController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/articles
 * @desc    Get all health library articles
 * @access  Public
 */
router.get('/', getArticles);

/**
 * @route   POST /api/articles
 * @desc    Create new article
 * @access  Private (Admin only)
 */
router.post('/', protect, authorizeRoles('admin'), createArticle);

/**
 * @route   GET /api/articles/:id
 * @desc    Get single article by id or slug
 * @access  Public
 */
router.get('/:id', getArticleById);

module.exports = router;
