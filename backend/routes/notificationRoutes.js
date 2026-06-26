const express = require('express');
const Notification = require('../models/Notification');
const { authenticateUser } = require('../middleware/auth');
const Router = express.Router();

Router.get('/', authenticateUser, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

Router.post('/:id/read', authenticateUser, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = Router;
