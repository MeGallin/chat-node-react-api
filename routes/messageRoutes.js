const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessages,
  deleteMessage,
} = require('../controllers/messageController');

router.post('/create-message', createMessage);
router.get('/:chatId', getMessages);
router.delete('/:messageId', deleteMessage);
module.exports = router;
