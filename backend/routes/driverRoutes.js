const express = require('express');
const Driver = require('../models/Driver');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { authenticateUser } = require('../middleware/auth');
const Notification = require('../models/Notification');
const Router = express.Router();

// Driver Registration
Router.post('/register', async (req, res) => {
  try {
    const { name, phone, password, vehicleType, vehicleModel } = req.body;
    
    let driver = await Driver.findOne({ phone });
    if (driver) return res.status(400).json({ message: 'Driver already exists' });
    
    driver = new Driver({
      name,
      phone,
      password: await bcrypt.hash(password, 10),
      vehicle: {
        type: vehicleType,
        model: vehicleModel
      },
      status: 'pending'
    });
    await driver.save();
    
    await Notification.create({
      userId: driver._id,
      userType: 'driver',
      title: 'Application Received',
      message: 'Your driver application is under review. Please wait for admin approval.',
      type: 'general'
    });
    
    res.status(201).json({ message: 'Driver application submitted', driver });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Driver Login
Router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    const driver = await Driver.findOne({ phone });
    if (!driver) return res.status(401).json({ message: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    
    if (driver.status === 'pending') {
      return res.status(403).json({ message: 'Application pending approval' });
    }
    
    if (driver.status === 'rejected') {
      return res.status(403).json({ message: `Application rejected: ${driver.rejectionReason}` });
    }
    
    const token = jwt.sign(
      { id: driver._id, type: 'driver' },
      process.env.JWT_SECRET || 'your_jwt_secret_key_change_this',
      { expiresIn: '30d' }
    );
    
    res.json({ message: 'Login successful', token, driver });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get driver profile
Router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const driver = await Driver.findById(req.userId);
    res.json({ driver });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update driver location
Router.post('/update-location', authenticateUser, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    await Driver.findByIdAndUpdate(
      req.userId,
      {
        'location.latitude': latitude,
        'location.longitude': longitude,
        'location.lastUpdated': new Date()
      },
      { new: true }
    );
    
    res.json({ message: 'Location updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Driver online/offline
Router.post('/status', authenticateUser, async (req, res) => {
  try {
    const { isOnline } = req.body;
    
    await Driver.findByIdAndUpdate(
      req.userId,
      { isOnline },
      { new: true }
    );
    
    res.json({ message: `Driver ${isOnline ? 'online' : 'offline'}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = Router;
