const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  recommendedSpecialty: {
    type: String,
    default: '',
  },
  suggestedDoctors: [
    {
      name: String,
      specialty: String,
      hospital: String,
      consultationFee: Number,
      rating: Number,
      id: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const aiConversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: 'Health Consultation',
      trim: true,
    },
    messages: [messageSchema],
    lastMessage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AiConversation', aiConversationSchema);
