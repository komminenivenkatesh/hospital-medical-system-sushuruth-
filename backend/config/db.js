/**
 * Database Configuration for NeuroCare Backend
 * Handles connection to MongoDB database via Mongoose.
 */

const mongoose = require('mongoose');

/**
 * Connect to MongoDB database instance with automatic retry.
 * Handles slow service starts on Windows and IPv4 loopback binding.
 *
 * @param {number} retries - Number of connection attempts before failing
 * @param {number} delayMs - Delay in ms between retries
 * @returns {Promise<typeof mongoose>} Mongoose connection object
 */
const connectDB = async (retries = 5, delayMs = 1500) => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/neurocare';

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 3000,
      });

      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.warn(`[MongoDB] Connection attempt ${attempt}/${retries} failed: ${error.message}`);
      if (attempt < retries) {
        console.log(`[MongoDB] Waiting ${delayMs / 1000}s for MongoDB service to be ready...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } else {
        console.error(`MongoDB Connection Fatal: Unable to connect to MongoDB at ${mongoURI} after ${retries} attempts.`);
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
module.exports.connectDB = connectDB;
