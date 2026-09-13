const mongoose = require('mongoose');

/**
 * Message Schema definition for NeuroCare backend
 */
const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: [true, 'Conversation ID is required'],
      index: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender is required']
    },
    senderType: {
      type: String,
      enum: {
        values: ['patient', 'doctor'],
        message: '{VALUE} is not a valid sender type'
      },
      required: [true, 'Sender type is required']
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true
    },
    read: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
