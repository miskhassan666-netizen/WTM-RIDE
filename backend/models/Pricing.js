const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
  city: {
    type: String,
    enum: ['Amman', 'Zarqa', 'Irbid'],
    required: true
  },
  baseFare: {
    type: Number,
    required: true,
    default: 1.5
  },
  perKmRate: {
    type: Number,
    required: true,
    default: 0.5
  },
  perMinuteRate: {
    type: Number,
    required: true,
    default: 0.1
  },
  minimumFare: {
    type: Number,
    required: true,
    default: 2
  },
  platformCommission: {
    type: Number,
    default: 15
  },
  driverPercentage: {
    type: Number,
    default: 85
  },
  minimumKmToCharge: {
    type: Number,
    default: 1
  },
  surgePricingEnabled: Boolean,
  surgePricingMultiplier: {
    type: Number,
    default: 1.5
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Pricing', pricingSchema);
