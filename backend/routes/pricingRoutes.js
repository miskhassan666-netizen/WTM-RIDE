const express = require('express');
const Pricing = require('../models/Pricing');
const Router = express.Router();

Router.get('/:city', async (req, res) => {
  try {
    let pricing = await Pricing.findOne({ city: req.params.city });
    if (!pricing) {
      pricing = new Pricing({ city: req.params.city });
      await pricing.save();
    }
    res.json({ pricing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = Router;
