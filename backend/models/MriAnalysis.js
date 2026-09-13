const mongoose = require('mongoose');

const mriDetailSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['ok', 'warn'],
      default: 'ok',
    },
  },
  { _id: false }
);

const mriAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    scanType: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Reviewed', 'Pending Review'],
      default: 'Reviewed',
    },
    findings: {
      type: String,
      required: true,
      trim: true,
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    risk: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      required: true,
    },
    severity: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    details: {
      type: [mriDetailSchema],
      default: [],
    },
    recommendations: {
      type: [String],
      default: [],
    },
    doctor: {
      type: String,
      default: 'Dr. Arvind Rao',
      trim: true,
    },
    specialty: {
      type: String,
      default: 'Neurologist',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MriAnalysis', mriAnalysisSchema);
