const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const socketIO = require('socket.io');
const http = require('http');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wtm-ride')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/rides', require('./routes/rideRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/drivers', require('./routes/driverRoutes'));
app.use('/api/pricing', require('./routes/pricingRoutes'));
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/ratings', require('./routes/ratingRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/support', require('./routes/supportRoutes'));
app.use('/api/charity', require('./routes/charityRoutes'));
app.use('/api/discounts', require('./routes/discountRoutes'));

// Socket.IO Events
io.on('connection', (socket) => {
  console.log('🔗 User Connected:', socket.id);

  socket.on('driver_online', (data) => {
    socket.join(`driver_${data.driverId}`);
    socket.broadcast.emit('driver_status_changed', { driverId: data.driverId, status: 'online' });
  });

  socket.on('driver_offline', (data) => {
    socket.leave(`driver_${data.driverId}`);
    socket.broadcast.emit('driver_status_changed', { driverId: data.driverId, status: 'offline' });
  });

  socket.on('update_location', (data) => {
    io.to(`ride_${data.rideId}`).emit('location_update', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ User Disconnected:', socket.id);
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Socket.IO ready on port ${PORT}`);
});

module.exports = { app, io };
