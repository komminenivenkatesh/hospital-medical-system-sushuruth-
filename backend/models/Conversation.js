const mongoose = require('mongoose');

/**
 * Conversation Schema definition for NeuroCare backend
 */
const conversationSchema = new mongoose.Schema(
  {
    participants: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      ],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length >= 2;
        },
        message: 'A conversation must have at least 2 participants'
      }
    },
    lastMessage: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
