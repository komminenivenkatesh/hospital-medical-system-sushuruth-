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
    videoFee: {
      type: Number,
      default: 600,
      min: [0, 'Video consultation fee cannot be negative']
    },
    bio: {
      type: String,
      trim: true,
      default: ''
    },
    languages: {
      type: [String],
      default: ['English', 'Hindi']
    },
    weeklySchedule: {
      type: Map,
      of: new mongoose.Schema({
        enabled: { type: Boolean, default: true },
        startTime: { type: String, default: '09:00' },
        endTime: { type: String, default: '17:00' }
      }, { _id: false }),
      default: () => ({
        Mon: { enabled: true, startTime: '09:00', endTime: '17:00' },
        Tue: { enabled: true, startTime: '09:00', endTime: '17:00' },
        Wed: { enabled: true, startTime: '09:00', endTime: '17:00' },
        Thu: { enabled: true, startTime: '09:00', endTime: '17:00' },
        Fri: { enabled: true, startTime: '09:00', endTime: '17:00' },
        Sat: { enabled: false, startTime: '09:00', endTime: '13:00' },
        Sun: { enabled: false, startTime: '09:00', endTime: '13:00' }
      })
    },
    slotDuration: {
      type: String,
      default: '20min'
    },
    blockedDates: {
      type: [String],
      default: []
    },
    availableToday: {
      type: Boolean,
      default: true
    },
    licenseNumber: {
      type: String,
      trim: true,
      default: ''
    },
    hospital: {
      type: String,
      trim: true,
      default: ''
    },
    verificationStatus: {
      type: String,
      enum: {
        values: ['Pending', 'Approved', 'Rejected'],
        message: '{VALUE} is not a valid verification status'
      },
      default: 'Pending'
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
