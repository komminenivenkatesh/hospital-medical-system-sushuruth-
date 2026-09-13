/**
 * NeuroCare / Sushruth - Healthcare Web App Backend Server
 * Main entry point for the Express application.
 */

const fs = require('fs');
const http = require('http');
const path = require('path');

// Load environment variables from backend/.env file
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');

// Ensure uploads directory exists for multer
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const cors = require('cors');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');

// Database and socket configurations
const connectDB = require('./config/db');
const initializeSocket = require('./config/socket');

// Route handlers
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const chatRoutes = require('./routes/chatRoutes');
const mriRoutes = require('./routes/mriRoutes');

// Error handling middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Handle uncaught exceptions before server initialization
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Security HTTP headers
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Body parsers with payload size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting: 100 requests per 15 minutes per IP for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});
app.use('/api', apiLimiter);

// API Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/mri', mriRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'NeuroCare API is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler for unmatched routes (must be after all route mounts)
app.use(notFound);

// Global error handling middleware (must be registered last)
app.use(errorHandler);

// Initialize Socket.io integration
initializeSocket(server);

// Define PORT
const PORT = process.env.PORT || 5000;

// Start database connection and launch server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start listening on HTTP server
    server.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to connect to database: ${error.message}`);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  console.error(err.stack);
  // Gracefully close server & exit process
  server.close(() => {
    process.exit(1);
  });
});
