const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    })
      .populate('participants', 'name email avatar role')
      .sort({ updatedAt: -1 });

    const convsWithMessages = await Promise.all(
      conversations.map(async (c) => {
        const messages = await Message.find({ conversationId: c._id })
          .sort({ createdAt: 1 })
          .populate('sender', 'name avatar');
        const obj = c.toObject();
        obj.messages = messages;
        return obj;
      })
    );

    res.json(convsWithMessages);
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const conversationId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const totalMessages = await Message.countDocuments({ conversationId });
    const totalPages = Math.ceil(totalMessages / limit);

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', 'name avatar');

    res.json({
      messages,
      page,
      totalPages,
      totalMessages
    });
  } catch (error) {
    next(error);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const conversationId = req.params.id;
    const { content, senderType } = req.body;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found or unauthorized' });
    }

    // Explicit senderType from client portal, or fall back to user's registered role
    const effectiveSenderType = senderType || req.user.role || 'patient';

    const message = await Message.create({
      conversationId,
      sender: req.user._id,
      senderType: effectiveSenderType,
      content
    });

    conversation.lastMessage = content;
    await conversation.save();

    const populatedMessage = await Message.findById(message._id).populate('sender', 'name avatar');

    res.status(201).json(populatedMessage);
  } catch (error) {
    next(error);
  }
};

const getOrCreateConversation = async (req, res, next) => {
  try {
    const { recipientId } = req.body;
    if (!recipientId) {
      return res.status(400).json({ message: 'Recipient ID is required' });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, recipientId] }
    }).populate('participants', 'name email avatar role');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, recipientId],
        lastMessage: ''
      });
      conversation = await Conversation.findById(conversation._id).populate('participants', 'name email avatar role');
    }

    res.json(conversation);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConversations,
  getMessages,
  sendMessage,
  getOrCreateConversation,
};
