const mongoose = require('mongoose');

const rechargeRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  userType: {
    type: String,
    enum: ['rider', 'driver'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  paymentMethod: String,
  approvedBy: mongoose.Schema.Types.ObjectId,
  rejectionReason: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: Date
});

module.exports = mongoose.model('RechargeRequest', rechargeRequestSchema);
