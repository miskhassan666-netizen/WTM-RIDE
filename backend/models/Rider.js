const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema({
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
  wallet: {
    balance: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    }
  },
  rideHistory: [{
    rideId: mongoose.Schema.Types.ObjectId,
    date: Date,
    amount: Number,
    driver: String
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
  homeAddress: String,
  workAddress: String,
  favoriteLocations: [String],
  emergencyContact: String,
  status: {
    type: String,
    enum: ['active', 'inactive', 'banned'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Rider', riderSchema);
