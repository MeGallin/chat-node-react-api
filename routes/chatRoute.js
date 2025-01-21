const express = require('express');
const router = express.Router();
const {
  createChat,
  findUserChats,
  findChat,
} = require('../controllers/chatController');

// Create a chat (individual or group)
router.post('/create-chat', createChat);

// Get all chats for a user
router.get('/:userId', findUserChats);

// Get a single chat (individual or group)
router.get('/find', findChat);

module.exports = router;
