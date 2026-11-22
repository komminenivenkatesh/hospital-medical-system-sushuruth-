const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    title: {
      type: String,
      default: 'Consultation Fee',
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: ['Video Consultation', 'In-Clinic Visit', 'Monthly Plan', 'MRI Review', 'Lab Test', 'Subscription'],
      default: 'Video Consultation',
    },
    specialty: {
      type: String,
      default: 'General Medicine',
    },
    status: {
      type: String,
      enum: ['Completed', 'Auto-renewed', 'Refunded', 'Pending', 'Failed'],
      default: 'Completed',
    },
    method: {
      type: String,
      enum: ['UPI', 'Card', 'Wallet', 'NetBanking'],
      default: 'UPI',
    },
    methodDetails: {
      type: String,
      default: '',
    },
    doctorGross: {
      type: Number,
      default: 0,
    },
    platformCommission: {
      type: Number,
      default: 0,
    },
    tds: {
      type: Number,
      default: 0,
    },
    doctorNet: {
      type: Number,
      default: 0,
    },
    invoiceNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate invoice number if not provided
transactionSchema.pre('save', function (next) {
  if (!this.invoiceNumber) {
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.invoiceNumber = `INV-${new Date().getFullYear()}-${randomHex}`;
  }
  // Automatically calculate doctor payouts if not set
  if (this.doctor && (!this.doctorGross || this.doctorGross === 0)) {
    this.doctorGross = this.amount;
    this.platformCommission = Math.round(this.amount * 0.15); // 15% platform commission
    this.tds = Math.round(this.amount * 0.05); // 5% TDS
    this.doctorNet = this.doctorGross - this.platformCommission - this.tds;
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
