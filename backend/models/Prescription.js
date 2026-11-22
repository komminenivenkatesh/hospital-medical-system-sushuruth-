const mongoose = require('mongoose');

/**
 * Medicine sub-schema for prescriptions
 */
const medicineItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Medicine name is required'],
    trim: true,
  },
  dosage: {
    type: String,
    required: true,
    trim: true, // e.g. "500mg" or "10mg"
  },
  frequency: {
    type: String,
    required: true,
    trim: true, // e.g. "Twice daily (after food)"
  },
  duration: {
    type: String,
    required: true,
    trim: true, // e.g. "14 days"
  },
  instructions: {
    type: String,
    default: '',
    trim: true,
  },
});

/**
 * Prescription Schema for Sushruth
 */
const prescriptionSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient reference is required'],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor reference is required'],
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    diagnosis: {
      type: String,
      required: [true, 'Diagnosis is required'],
      trim: true,
    },
    medicines: {
      type: [medicineItemSchema],
      default: [],
    },
    advice: {
      type: String,
      default: '',
    },
    followUpDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Active', 'Completed'],
      default: 'Active',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;
