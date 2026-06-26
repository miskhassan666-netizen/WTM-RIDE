const express = require('express');
const Wallet = require('../models/Wallet');
const { authenticateUser } = require('../middleware/auth');
const Router = express.Router();

Router.get('/balance', authenticateUser, async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.userId, userType: req.userType });
    if (!wallet) {
      wallet = new Wallet({ userId: req.userId, userType: req.userType });
      await wallet.save();
    }
    res.json({ wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

Router.get('/transactions', authenticateUser, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.userId, userType: req.userType });
    res.json({ transactions: wallet?.transactions || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = Router;
