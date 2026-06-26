const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: String,
  profileImage: String,
  vehicle: {
    type: {
      type: String,
      enum: ['Economy', 'Premium', 'Luxury'],
      required: true
    },
    model: String,
    plate: String,
    color: String,
    year: Number,
    image: String
  },
  documents: {
    licenseNumber: String,
    licenseExpiry: Date,
    insuranceExpiry: Date,
    registrationExpiry: Date
  },
  wallet: {
    balance: {
      type: Number,
      default: 0
    },
    totalEarnings: {
      type: Number,
      default: 0
    },
    commissionPaid: {
      type: Number,
      default: 0
    }
  },
  location: {
    latitude: Number,
    longitude: Number,
    lastUpdated: Date
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  rideHistory: [{
    rideId: mongoose.Schema.Types.ObjectId,
    date: Date,
    amount: Number,
    rider: String
  }],
  rating: {
    average: {
      type: Number,
      default: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  totalRides: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'active', 'inactive', 'banned'],
    default: 'pending'
  },
  approvedBy: mongoose.Schema.Types.ObjectId,
  rejectionReason: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Driver', driverSchema);
