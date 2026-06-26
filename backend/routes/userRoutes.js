const express = require('express');
const Rider = require('../models/Rider');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { authenticateUser } = require('../middleware/auth');
const Router = express.Router();

// Rider Registration
Router.post('/rider/register', async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    
    let rider = await Rider.findOne({ phone });
    if (rider) return res.status(400).json({ message: 'Rider already exists' });
    
    rider = new Rider({
      name,
      phone,
      password: await bcrypt.hash(password, 10)
    });
    await rider.save();
    
    const token = jwt.sign(
      { id: rider._id, type: 'rider' },
      process.env.JWT_SECRET || 'your_jwt_secret_key_change_this',
      { expiresIn: '30d' }
    );
    
    res.status(201).json({ message: 'Rider registered', token, rider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rider Login
Router.post('/rider/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    const rider = await Rider.findOne({ phone });
    if (!rider) return res.status(401).json({ message: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, rider.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign(
      { id: rider._id, type: 'rider' },
      process.env.JWT_SECRET || 'your_jwt_secret_key_change_this',
      { expiresIn: '30d' }
    );
    
    res.json({ message: 'Login successful', token, rider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get rider profile
Router.get('/rider/profile', authenticateUser, async (req, res) => {
  try {
    const rider = await Rider.findById(req.userId);
    res.json({ rider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = Router;
