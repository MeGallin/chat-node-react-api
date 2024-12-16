const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const uri = process.env.MONGODB_URI;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('Failed to connect to MongoDB');
    console.error('Error details:', err.message);
    throw err;
  }
};

module.exports = connectToDatabase;
