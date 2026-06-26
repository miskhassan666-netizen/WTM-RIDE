const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  description: String,
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  discountValue: {
    type: Number,
    required: true
  },
  validFrom: {
    type: Date,
    required: true
  },
  validTo: {
    type: Date,
    required: true
  },
  maxUsagePerUser: {
    type: Number,
    default: 1
  },
  usageCount: {
    type: Number,
    default: 0
  },
  usedBy: [{
    userId: mongoose.Schema.Types.ObjectId,
    usageCount: Number,
    lastUsed: Date
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Discount', discountSchema);
