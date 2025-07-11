const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Load models in correct order (Department before User)
require('./models');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const departmentRoutes = require('./routes/departments');
const assignmentRoutes = require('./routes/assignments');
const attendanceRoutes = require('./routes/attendance');
const timetableRoutes = require('./routes/timetable');
const certificateRoutes = require('./routes/certificates');
const feedbackRoutes = require('./routes/feedback');
const sectionRoutes = require('./routes/sections');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:3004',
      'http://localhost:3005'
    ];
    
    // Allow requests from allowed origins
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // Allow requests from your production domain (if you have one)
    if (origin && origin.includes('your-production-domain.com')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Social Network API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/sections', sectionRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  
  // Start server only after DB connection
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 API Health: http://localhost:${PORT}/api/health`);
  });
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('📦 MongoDB connection closed.');
    process.exit(0);
  });
});

module.exports = app;