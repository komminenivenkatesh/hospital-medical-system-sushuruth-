const mongoose = require('mongoose');

/**
 * Hospital Schema definition for Sushruth platform
 */
const hospitalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Associated User reference is required'],
      unique: true
    },
    name: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true
    },
    type: {
      type: String,
      default: 'Multi-Specialty',
      trim: true
    },
    licenseNumber: {
      type: String,
      required: [true, 'Clinical establishment license number is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City and location is required'],
      trim: true
    },
    address: {
      type: String,
      default: '',
      trim: true
    },
    totalBeds: {
      type: Number,
      default: 150,
      min: [0, 'Total beds cannot be negative']
    },
    availableBeds: {
      type: Number,
      default: 35,
      min: [0, 'Available beds cannot be negative']
    },
    facilities: {
      type: [String],
      default: ['24/7 Emergency', 'ICU Facilities', 'Advanced MRI', 'In-house Pharmacy', 'Blood Bank', 'Ambulance']
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5
    },
    reviews: {
      type: String,
      default: '1.2k'
    },
    price: {
      type: String,
      default: '₹100'
    },
    waitMinutes: {
      type: Number,
      default: 15
    },
    distance: {
      type: String,
      default: '15KM'
    },
    img: {
      type: String,
      default: ''
    },
    verificationStatus: {
      type: String,
      enum: {
        values: ['Pending', 'Approved', 'Rejected'],
        message: '{VALUE} is not a valid verification status'
      },
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

const Hospital = mongoose.model('Hospital', hospitalSchema);

module.exports = Hospital;
