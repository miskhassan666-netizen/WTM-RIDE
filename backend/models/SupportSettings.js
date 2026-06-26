const mongoose = require('mongoose');

const supportSettingsSchema = new mongoose.Schema({
  supportPhone: String,
  whatsappNumber: String,
  telegramLink: String,
  emailSupport: String,
  websiteLink: String,
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SupportSettings', supportSettingsSchema);
