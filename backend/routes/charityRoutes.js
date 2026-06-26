const express = require('express');
const Charity = require('../models/Charity');
const Router = express.Router();

Router.get('/', async (req, res) => {
  try {
    let charity = await Charity.findOne();
    if (!charity) {
      charity = new Charity();
      await charity.save();
    }
    res.json({ charity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = Router;
