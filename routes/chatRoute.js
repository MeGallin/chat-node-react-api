const express = require('express');
const router = express.Router();
const {
  createChat,
  findUserChats,
  findChat,
} = require('../controllers/chatController');

router.post('/create-chat', createChat);
router.get('/:userId', findUserChats); //get all chats
router.get('/find/:firstUserId/:secondUserId', findChat); //get single chat
module.exports = router;
