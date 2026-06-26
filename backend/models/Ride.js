const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  rideNumber: {
    type: String,
    unique: true
  },
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rider',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  pickupLocation: {
    address: String,
    latitude: Number,
    longitude: Number
  },
  dropLocation: {
    address: String,
    latitude: Number,
    longitude: Number
  },
  city: {
    type: String,
    enum: ['Amman', 'Zarqa', 'Irbid'],
    required: true
  },
  serviceType: {
    type: String,
    enum: ['Economy', 'Premium', 'Luxury'],
    default: 'Economy'
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'started', 'completed', 'cancelled'],
    default: 'requested'
  },
  distance: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0
  },
  pricing: {
    baseFare: Number,
    perKmRate: Number,
    perMinuteRate: Number,
    minimumFare: Number,
    totalFare: Number,
    platformCommission: Number,
    driverEarnings: Number,
    discountApplied: Number,
    charityDeduction: Number,
    finalAmount: Number
  },
  payment: {
    method: {
      type: String,
      enum: ['cash', 'wallet'],
      default: 'wallet'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    discountCode: String
  },
  riderRating: {
    score: Number,
    comment: String
  },
  driverRating: {
    score: Number,
    comment: String
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  acceptedAt: Date,
  startedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  cancelledBy: {
    type: String,
    enum: ['rider', 'driver', 'system']
  },
  cancellationReason: String
});

// Generate ride number before saving
rideSchema.pre('save', async function(next) {
  if (!this.rideNumber) {
    const count = await mongoose.model('Ride').countDocuments();
    this.rideNumber = `RIDE-${Date.now()}-${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Ride', rideSchema);
