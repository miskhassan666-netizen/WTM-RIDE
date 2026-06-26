const express = require('express');
const Router = express.Router();

// Support routes (can be expanded)
Router.get('/contact', (req, res) => {
  res.json({ message: 'Support contact info' });
});

module.exports = Router;
