const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  userType: {
    type: String,
    enum: ['rider', 'driver', 'admin'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['ride_request', 'ride_accepted', 'ride_completed', 'payment', 'promotion', 'support', 'general'],
    default: 'general'
  },
  data: mongoose.Schema.Types.Mixed,
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
