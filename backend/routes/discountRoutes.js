const express = require('express');
const Discount = require('../models/Discount');
const Router = express.Router();

Router.post('/apply', async (req, res) => {
  try {
    const { code } = req.body;
    const discount = await Discount.findOne({ code, isActive: true });
    
    if (!discount) return res.status(404).json({ message: 'Discount not found' });
    if (new Date() < discount.validFrom || new Date() > discount.validTo) {
      return res.status(400).json({ message: 'Discount expired' });
    }
    
    res.json({ discount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = Router;
