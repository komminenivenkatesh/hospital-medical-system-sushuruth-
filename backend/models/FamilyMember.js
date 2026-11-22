const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    relation: {
      type: String,
      enum: ['Self', 'Spouse', 'Child', 'Parent', 'Sibling', 'Other'],
      default: 'Spouse',
      required: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: 0,
      max: 130,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Female',
    },
    bloodGroup: {
      type: String,
      default: 'O+',
    },
    primary: {
      type: Boolean,
      default: false,
    },
    allergies: {
      type: [String],
      default: [],
    },
    conditions: {
      type: [String],
      default: [],
    },
    emergencyContact: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('FamilyMember', familyMemberSchema);
