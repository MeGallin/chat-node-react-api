const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessages,
  deleteMessage,
} = require('../controllers/messageController');

// Create a new message (individual or group chat)
router.post('/create-message', createMessage);

// Get all messages for a specific chat (individual or group)
router.get('/:chatId', getMessages);

// Delete a specific message by its ID
router.delete('/:messageId', deleteMessage);

module.exports = router;
