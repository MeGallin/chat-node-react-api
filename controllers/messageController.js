const messageModel = require('../models/messageModel');

const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  try {
    const newMessage = new messageModel({
      chatId,
      senderId,
      text,
    });
    const response = await newMessage.save();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//Get messages
const getMessages = async (req, res) => {
  const chatId = req.params;
  try {
    const messages = await messageModel.find({
      chatId: chatId.chatId || chatId,
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { createMessage, getMessages };
