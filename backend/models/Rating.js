const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  rideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
    required: true
  },
  rater: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  raterType: {
    type: String,
    enum: ['rider', 'driver'],
    required: true
  },
  rated: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  ratedType: {
    type: String,
    enum: ['rider', 'driver'],
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Rating', ratingSchema);
