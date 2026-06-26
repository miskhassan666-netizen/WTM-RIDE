const express = require('express');
const Rider = require('../models/Rider');
const Driver = require('../models/Driver');
const Pricing = require('../models/Pricing');
const Discount = require('../models/Discount');
const Wallet = require('../models/Wallet');
const RechargeRequest = require('../models/RechargeRequest');
const Notification = require('../models/Notification');
const SupportSettings = require('../models/SupportSettings');
const Charity = require('../models/Charity');
const Rating = require('../models/Rating');
const Ride = require('../models/Ride');
const { authenticateAdmin } = require('../middleware/auth');
const Router = express.Router();

// Get all riders with filter
Router.get('/riders', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', status = 'active' } = req.query;
    const skip = (page - 1) * limit;
    
    const query = { status };
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { phone: search }];
    
    const riders = await Rider.find(query).skip(skip).limit(limit);
    const total = await Rider.countDocuments(query);
    
    res.json({ riders, total, page, limit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get rider details
Router.get('/riders/:id', authenticateAdmin, async (req, res) => {
  try {
    const rider = await Rider.findById(req.params.id);
    const rides = await Ride.find({ rider: req.params.id });
    const ratings = await Rating.find({ rated: req.params.id, ratedType: 'rider' });
    
    res.json({ rider, rides, ratings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add credit to rider
Router.post('/riders/:id/add-credit', authenticateAdmin, async (req, res) => {
  try {
    const { amount } = req.body;
    const rider = await Rider.findByIdAndUpdate(
      req.params.id,
      { $inc: { 'wallet.balance': amount } },
      { new: true }
    );
    
    await Wallet.findOneAndUpdate(
      { userId: req.params.id, userType: 'rider' },
      { $inc: { balance: amount }, $push: { transactions: { type: 'credit', amount, description: 'Admin credit' } } },
      { upsert: true }
    );
    
    res.json({ message: 'Credit added', rider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all drivers with pending requests
Router.get('/drivers', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', status = 'active' } = req.query;
    const skip = (page - 1) * limit;
    
    const query = { status };
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { phone: search }];
    
    const drivers = await Driver.find(query).skip(skip).limit(limit);
    const total = await Driver.countDocuments(query);
    
    res.json({ drivers, total, page, limit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending driver requests
Router.get('/drivers/pending/requests', authenticateAdmin, async (req, res) => {
  try {
    const drivers = await Driver.find({ status: 'pending' });
    res.json({ drivers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve driver
Router.post('/drivers/:id/approve', authenticateAdmin, async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', approvedBy: req.adminId },
      { new: true }
    );
    
    await Notification.create({
      userId: driver._id,
      userType: 'driver',
      title: 'Application Approved',
      message: 'Your driver application has been approved! You can now start accepting rides.',
      type: 'general'
    });
    
    res.json({ message: 'Driver approved', driver });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reject driver
Router.post('/drivers/:id/reject', authenticateAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', rejectionReason: reason },
      { new: true }
    );
    
    res.json({ message: 'Driver rejected', driver });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get rides with filter
Router.get('/rides', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, fromDate, toDate, city, status } = req.query;
    const skip = (page - 1) * limit;
    
    const query = {};
    if (fromDate || toDate) {
      query.requestedAt = {};
      if (fromDate) query.requestedAt.$gte = new Date(fromDate);
      if (toDate) query.requestedAt.$lte = new Date(toDate);
    }
    if (city) query.city = city;
    if (status) query.status = status;
    
    const rides = await Ride.find(query).populate('rider driver').skip(skip).limit(limit);
    const total = await Ride.countDocuments(query);
    
    res.json({ rides, total, page, limit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get ride details
Router.get('/rides/:id', authenticateAdmin, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate('rider driver');
    res.json({ ride });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pricing by city
Router.get('/pricing/:city', authenticateAdmin, async (req, res) => {
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

// Update pricing
Router.post('/pricing/:city', authenticateAdmin, async (req, res) => {
  try {
    const pricing = await Pricing.findOneAndUpdate(
      { city: req.params.city },
      req.body,
      { new: true, upsert: true }
    );
    res.json({ message: 'Pricing updated', pricing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create discount code
Router.post('/discounts', authenticateAdmin, async (req, res) => {
  try {
    const discount = new Discount(req.body);
    await discount.save();
    res.status(201).json({ message: 'Discount created', discount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all discounts
Router.get('/discounts', authenticateAdmin, async (req, res) => {
  try {
    const discounts = await Discount.find();
    res.json({ discounts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update discount
Router.put('/discounts/:id', authenticateAdmin, async (req, res) => {
  try {
    const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Discount updated', discount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recharge requests
Router.get('/recharge-requests', authenticateAdmin, async (req, res) => {
  try {
    const { status = 'pending' } = req.query;
    const requests = await RechargeRequest.find({ status }).populate('userId');
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve recharge request
Router.post('/recharge-requests/:id/approve', authenticateAdmin, async (req, res) => {
  try {
    const request = await RechargeRequest.findById(req.params.id);
    
    await Wallet.findOneAndUpdate(
      { userId: request.userId, userType: request.userType },
      { $inc: { balance: request.amount }, $push: { transactions: { type: 'credit', amount: request.amount, description: 'Recharge approved' } } },
      { upsert: true }
    );
    
    await RechargeRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', approvedBy: req.adminId, approvedAt: new Date() },
      { new: true }
    );
    
    res.json({ message: 'Recharge approved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send notification
Router.post('/notifications/send', authenticateAdmin, async (req, res) => {
  try {
    const { userType, title, message } = req.body;
    let users = [];
    
    if (userType === 'rider') users = await Rider.find();
    else if (userType === 'driver') users = await Driver.find();
    
    const notifications = users.map(user => ({
      userId: user._id,
      userType,
      title,
      message,
      type: 'general'
    }));
    
    await Notification.insertMany(notifications);
    res.json({ message: 'Notifications sent', count: notifications.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get support settings
Router.get('/support', authenticateAdmin, async (req, res) => {
  try {
    let settings = await SupportSettings.findOne();
    if (!settings) {
      settings = new SupportSettings();
      await settings.save();
    }
    res.json({ settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update support settings
Router.post('/support', authenticateAdmin, async (req, res) => {
  try {
    let settings = await SupportSettings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json({ message: 'Support settings updated', settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get charity box
Router.get('/charity', authenticateAdmin, async (req, res) => {
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

// Update charity settings
Router.post('/charity', authenticateAdmin, async (req, res) => {
  try {
    let charity = await Charity.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json({ message: 'Charity updated', charity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get ratings
Router.get('/ratings', authenticateAdmin, async (req, res) => {
  try {
    const { userId, userType } = req.query;
    const query = {};
    if (userId && userType) {
      query.rated = userId;
      query.ratedType = userType;
    }
    
    const ratings = await Rating.find(query);
    res.json({ ratings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Dashboard stats
Router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    const totalRiders = await Rider.countDocuments();
    const totalDrivers = await Driver.countDocuments({ status: 'approved' });
    const totalRides = await Ride.countDocuments();
    const totalRevenue = await Ride.aggregate([{ $group: { _id: null, total: { $sum: '$pricing.platformCommission' } } }]);
    
    res.json({
      totalRiders,
      totalDrivers,
      totalRides,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = Router;
