/**
 * Database Configuration for NeuroCare Backend
 * Handles connection to MongoDB database via Mongoose.
 */

const mongoose = require('mongoose');

/**
 * Connect to MongoDB database instance.
 * Uses process.env.MONGO_URI for connection string.
 * Logs connection details on success or exits process on failure.
 *
 * @returns {Promise<typeof mongoose>} Mongoose connection object
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/neurocare';
    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
module.exports.connectDB = connectDB;
