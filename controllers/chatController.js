const chatModel = require('../models/chatModel');
//create chat api
// get all chats api
// get single chat api

const createChat = async (req, res) => {
  const { firstUserId, secondUserId } = req.body;
  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstUserId, secondUserId] },
    });
    if (chat) return res.status(200).json(chat);
    const newChat = new chatModel({ members: [firstUserId, secondUserId] });
    const response = await newChat.save();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findUserChats = async (req, res) => {
  const userId = req.params.userId;
  try {
    const chats = await chatModel.find({ members: { $in: [userId] } });
    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findChat = async (req, res) => {
  const { firstUserId, secondUserId } = req.params;
  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstUserId, secondUserId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  createChat,
  findUserChats,
  findChat,
};
