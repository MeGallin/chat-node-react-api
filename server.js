/******************************************
 *  server.js
 ******************************************/
const express = require('express');
require('dotenv').config({ path: './.env' });
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');

const connectToDatabase = require('./config/config');

const userRoute = require('./routes/userRoute');
const chatRoute = require('./routes/chatRoute');
const messageRoute = require('./routes/messageRoutes');

const app = express();

// Set main port to 8000 or pull from environment
const port = process.env.PORT || 8000;

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB and start server
async function startServer() {
  try {
    await connectToDatabase();

    // Define your routes
    app.use('/api/users', userRoute);
    app.use('/api/chats', chatRoute);
    app.use('/api/messages', messageRoute);

    // Create an HTTP server from the Express app
    const server = http.createServer(app);

    // Start the server
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    // Attach Socket.IO to the same HTTP server
    const io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST'],
      },
    });

    // Keep track of online users
    let onlineUsers = [];

    // Listen for Socket.IO connections
    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);

      // Add a new user
      socket.on('addNewUser', (userId) => {
        if (!onlineUsers.some((user) => user.userId === userId)) {
          onlineUsers.push({
            userId,
            socketId: socket.id,
          });
        }
        io.emit('getOnlineUsers', onlineUsers);
      });

      // Handle messages
      socket.on('sendMessage', (message) => {
        const user = onlineUsers.find((u) => u.userId === message.recipientId);
        if (user) {
          io.to(user.socketId).emit('getMessage', message);
          io.to(user.socketId).emit('getNotification', {
            senderId: message.senderId,
            isRead: false,
            date: new Date(),
          });
        }
      });

      // Remove user on disconnect
      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
        io.emit('getOnlineUsers', onlineUsers);
      });
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

startServer();
