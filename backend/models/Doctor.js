const mongoose = require('mongoose');

/**
 * Doctor Schema definition for NeuroCare backend
 */
const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Associated User reference is required'],
      unique: true
    },
    specialty: {
      type: String,
      required: [true, 'Specialty is required'],
      trim: true
    },
    experienceYears: {
      type: Number,
      default: 0,
      min: [0, 'Experience years cannot be negative']
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5']
    },
    consultationFee: {
      type: Number,
      default: 0,
      min: [0, 'Consultation fee cannot be negative']
    },
    availableToday: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      enum: {
        values: ['Available', 'Busy', 'Offline'],
        message: '{VALUE} is not a valid status'
      },
      default: 'Available'
    }
  },
  {
    timestamps: true
  }
);

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
