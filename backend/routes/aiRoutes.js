const express = require('express');
const router = express.Router();
const {
  getAiConversations,
  getAiConversationById,
  sendAiMessage,
  deleteAiConversation,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// All AI assistant routes require authentication
router.use(protect);

router.get('/conversations', getAiConversations);
router.get('/conversations/:id', getAiConversationById);
router.post('/chat', sendAiMessage);
router.delete('/conversations/:id', deleteAiConversation);

module.exports = router;
