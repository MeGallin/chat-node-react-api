const express = require('express');
require('dotenv').config({ path: './.env' });
const cors = require('cors');
const connectToDatabase = require('./config/config');

const userRoute = require('./routes/userRoute');
const chatRoute = require('./routes/chatRoute');
const messageRoute = require('./routes/messageRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB
async function startServer() {
  try {
    await connectToDatabase();
    //Routes
    app.use('/api/users', userRoute);
    app.use('/api/chats', chatRoute);
    app.use('/api/messages', messageRoute);

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

startServer();
