const express = require('express');
const Rating = require('../models/Rating');
const Rider = require('../models/Rider');
const Driver = require('../models/Driver');
const { authenticateUser } = require('../middleware/auth');
const Router = express.Router();

Router.post('/', authenticateUser, async (req, res) => {
  try {
    const { rideId, ratedId, ratedType, score, comment } = req.body;
    
    const rating = new Rating({
      rideId,
      rater: req.userId,
      raterType: req.userType,
      rated: ratedId,
      ratedType,
      score,
      comment
    });
    await rating.save();
    
    // Update average rating
    const ratings = await Rating.find({ rated: ratedId, ratedType });
    const average = ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length;
    
    if (ratedType === 'rider') {
      await Rider.findByIdAndUpdate(ratedId, { 'rating.average': average, 'rating.count': ratings.length });
    } else {
      await Driver.findByIdAndUpdate(ratedId, { 'rating.average': average, 'rating.count': ratings.length });
    }
    
    res.status(201).json({ message: 'Rating submitted', rating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = Router;
