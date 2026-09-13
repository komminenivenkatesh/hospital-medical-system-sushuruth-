const mongoose = require('mongoose');

/**
 * Appointment Schema definition for NeuroCare backend
 */
const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient reference is required']
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor reference is required']
    },
    type: {
      type: String,
      enum: {
        values: ['video', 'chat', 'in-person'],
        message: '{VALUE} is not a valid appointment type'
      },
      required: [true, 'Appointment type is required']
    },
    date: {
      type: Date,
      required: [true, 'Appointment date is required']
    },
    slot: {
      type: String,
      required: [true, 'Time slot is required'],
      trim: true
    },
    reason: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'completed', 'cancelled'],
        message: '{VALUE} is not a valid appointment status'
      },
      default: 'pending'
    },
    shareHistory: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
