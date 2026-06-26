const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Router = express.Router();

// Admin Login
Router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    let admin = await Admin.findOne({ phone });
    
    // Create default admin if doesn't exist
    if (!admin && phone === '0790000000' && password === '123456') {
      admin = new Admin({
        phone: '0790000000',
        password: '123456',
        role: 'admin'
      });
      await admin.save();
    }
    
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
    
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign(
      { id: admin._id, type: 'admin' },
      process.env.JWT_SECRET || 'your_jwt_secret_key_change_this',
      { expiresIn: '30d' }
    );
    
    res.json({ 
      message: 'Login successful',
      token, 
      admin: {
        id: admin._id,
        phone: admin.phone,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Register
Router.post('/register', async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    const admin = new Admin({ phone, password });
    await admin.save();
    
    const token = jwt.sign(
      { id: admin._id, type: 'admin' },
      process.env.JWT_SECRET || 'your_jwt_secret_key_change_this',
      { expiresIn: '30d' }
    );
    
    res.status(201).json({ message: 'Admin created', token, admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = Router;
