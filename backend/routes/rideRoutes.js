const express = require('express');
const Ride = require('../models/Ride');
const Rider = require('../models/Rider');
const Driver = require('../models/Driver');
const Pricing = require('../models/Pricing');
const Discount = require('../models/Discount');
const Wallet = require('../models/Wallet');
const Notification = require('../models/Notification');
const Charity = require('../models/Charity');
const { authenticateUser } = require('../middleware/auth');
const Router = express.Router();

// Request a ride
Router.post('/request', authenticateUser, async (req, res) => {
  try {
    const { pickupLat, pickupLng, dropLat, dropLng, pickupAddress, dropAddress, city, serviceType, discountCode, paymentMethod } = req.body;
    
    // Get pricing for city
    let pricing = await Pricing.findOne({ city });
    if (!pricing) {
      pricing = new Pricing({ city });
      await pricing.save();
    }
    
    // Calculate distance (mock)
    const distance = Math.abs(Math.sqrt(Math.pow(dropLat - pickupLat, 2) + Math.pow(dropLng - pickupLng, 2))) * 111 || 5; // Approximate
    
    let fare = pricing.baseFare + (distance * pricing.perKmRate);
    fare = Math.max(fare, pricing.minimumFare);
    
    // Apply discount
    let discountAmount = 0;
    if (discountCode) {
      const discount = await Discount.findOne({ code: discountCode, isActive: true });
      if (discount && new Date() >= discount.validFrom && new Date() <= discount.validTo) {
        discountAmount = discount.discountType === 'percentage' ? (fare * discount.discountValue / 100) : discount.discountValue;
        fare -= discountAmount;
      }
    }
    
    // Calculate charity deduction
    const charity = await Charity.findOne();
    let charityAmount = 0;
    if (charity && charity.isEnabled) {
      charityAmount = fare * charity.deductionPercentage / 100;
    }
    
    const finalAmount = fare - charityAmount;
    const platformCommission = fare * pricing.platformCommission / 100;
    const driverEarnings = fare - platformCommission - charityAmount;
    
    const ride = new Ride({
      rider: req.userId,
      pickupLocation: { address: pickupAddress, latitude: pickupLat, longitude: pickupLng },
      dropLocation: { address: dropAddress, latitude: dropLat, longitude: dropLng },
      city,
      serviceType,
      status: 'requested',
      distance,
      pricing: {
        baseFare: pricing.baseFare,
        perKmRate: pricing.perKmRate,
        perMinuteRate: pricing.perMinuteRate,
        minimumFare: pricing.minimumFare,
        totalFare: fare,
        platformCommission,
        driverEarnings,
        discountApplied: discountAmount,
        charityDeduction: charityAmount,
        finalAmount
      },
      payment: {
        method: paymentMethod || 'wallet',
        discountCode
      }
    });
    
    await ride.save();
    
    // Find nearby drivers (mock - get 5 random approved drivers)
    const nearbyDrivers = await Driver.find({ status: 'approved', isOnline: true }).limit(5);
    
    // Send notifications to drivers
    nearbyDrivers.forEach(driver => {
      Notification.create({
        userId: driver._id,
        userType: 'driver',
        title: 'New Ride Request',
        message: `Ride from ${pickupAddress} to ${dropAddress}`,
        type: 'ride_request',
        data: { rideId: ride._id, fare: finalAmount }
      });
    });
    
    res.status(201).json({
      message: 'Ride requested',
      ride: {
        ...ride.toObject(),
        estimatedFare: finalAmount,
        estimatedDistance: distance
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Accept ride (driver)
Router.post('/:id/accept', authenticateUser, async (req, res) => {
  try {
    const ride = await Ride.findByIdAndUpdate(
      req.params.id,
      { driver: req.userId, status: 'accepted', acceptedAt: new Date() },
      { new: true }
    ).populate('rider driver');
    
    // Notify rider
    await Notification.create({
      userId: ride.rider._id,
      userType: 'rider',
      title: 'Driver Accepted',
      message: `${ride.driver.name} accepted your ride`,
      type: 'ride_accepted',
      data: { rideId: ride._id, driver: ride.driver }
    });
    
    res.json({ message: 'Ride accepted', ride });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start ride
Router.post('/:id/start', authenticateUser, async (req, res) => {
  try {
    const ride = await Ride.findByIdAndUpdate(
      req.params.id,
      { status: 'started', startedAt: new Date() },
      { new: true }
    );
    
    res.json({ message: 'Ride started', ride });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Complete ride
Router.post('/:id/complete', authenticateUser, async (req, res) => {
  try {
    const ride = await Ride.findByIdAndUpdate(
      req.params.id,
      { status: 'completed', completedAt: new Date() },
      { new: true }
    ).populate('rider driver');
    
    // Process payment
    const finalAmount = ride.pricing.finalAmount;
    await Wallet.findOneAndUpdate(
      { userId: ride.rider._id, userType: 'rider' },
      { $inc: { balance: -finalAmount }, $push: { transactions: { type: 'debit', amount: finalAmount, description: 'Ride payment', rideId: ride._id } } },
      { upsert: true }
    );
    
    await Wallet.findOneAndUpdate(
      { userId: ride.driver._id, userType: 'driver' },
      { $inc: { balance: ride.pricing.driverEarnings }, $push: { transactions: { type: 'credit', amount: ride.pricing.driverEarnings, description: 'Ride earnings', rideId: ride._id } } },
      { upsert: true }
    );
    
    res.json({ message: 'Ride completed', ride });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel ride
Router.post('/:id/cancel', authenticateUser, async (req, res) => {
  try {
    const { reason } = req.body;
    const userType = req.userType;
    
    const ride = await Ride.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled', cancelledAt: new Date(), cancelledBy: userType, cancellationReason: reason },
      { new: true }
    );
    
    res.json({ message: 'Ride cancelled', ride });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get ride details
Router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate('rider driver');
    res.json({ ride });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get ride history (rider)
Router.get('/history/rider', authenticateUser, async (req, res) => {
  try {
    const rides = await Ride.find({ rider: req.userId }).sort({ requestedAt: -1 });
    res.json({ rides });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get ride history (driver)
Router.get('/history/driver', authenticateUser, async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.userId }).sort({ requestedAt: -1 });
    res.json({ rides });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = Router;
