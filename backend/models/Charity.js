const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Charity Box'
  },
  isEnabled: {
    type: Boolean,
    default: true
  },
  deductionPercentage: {
    type: Number,
    default: 2
  },
  deductFrom: {
    type: String,
    enum: ['rider', 'driver', 'both'],
    default: 'driver'
  },
  totalCollected: {
    type: Number,
    default: 0
  },
  transactions: [{
    rideId: mongoose.Schema.Types.ObjectId,
    amount: Number,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Charity', charitySchema);
