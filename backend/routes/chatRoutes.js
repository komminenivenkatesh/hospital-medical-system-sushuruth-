const express = require('express');
const router = express.Router();
const {
  getConversations,
  getMessages,
  sendMessage,
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// Protect all chat routes
router.use(protect);

/**
 * @route   GET /api/chat/conversations
 * @desc    Get user conversations
 * @access  Private
 */
router.get('/conversations', getConversations);

/**
 * @route   GET /api/chat/conversations/:id/messages
 * @desc    Get messages for a specific conversation
 * @access  Private
 */
router.get('/conversations/:id/messages', getMessages);

/**
 * @route   POST /api/chat/conversations/:id/messages
 * @desc    Send a message in a conversation
 * @access  Private
 */
router.post('/conversations/:id/messages', sendMessage);

module.exports = router;
