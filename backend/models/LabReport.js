const mongoose = require('mongoose');

/**
 * Parameter item schema for structured lab tests (e.g., Hemoglobin, Platelets)
 */
const labParameterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  value: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    default: '',
  },
  referenceRange: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Normal', 'Borderline', 'Abnormal'],
    default: 'Normal',
  },
});

/**
 * Lab Report Schema for Sushruth
 */
const labReportSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient reference is required'],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
    },
    labName: {
      type: String,
      default: 'Sushruth Diagnostics & Imaging Labs',
      trim: true,
    },
    testName: {
      type: String,
      required: [true, 'Test name is required'],
      trim: true, // e.g. "Complete Blood Count (CBC)", "Lipid Panel"
    },
    category: {
      type: String,
      default: 'Hematology',
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    resultStatus: {
      type: String,
      enum: ['Normal', 'Borderline', 'Abnormal'],
      default: 'Normal',
    },
    parameters: {
      type: [labParameterSchema],
      default: [],
    },
    notes: {
      type: String,
      default: '',
    },
    fileUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const LabReport = mongoose.model('LabReport', labReportSchema);

module.exports = LabReport;
