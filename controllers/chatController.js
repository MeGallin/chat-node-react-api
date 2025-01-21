const chatModel = require('../models/chatModel');

// Create a new chat (individual or group)
const createChat = async (req, res) => {
  const { firstUserId, secondUserId, group, name, members } = req.body;

  try {
    if (group) {
      // Group chat creation
      if (!name || !members || members.length < 2) {
        return res
          .status(400)
          .json({ error: 'Group name and at least two members are required.' });
      }

      // Check if a group with the same name and members already exists
      const existingGroup = await chatModel.findOne({
        group: true,
        name,
        members: { $all: members },
      });

      if (existingGroup) {
        return res.status(400).json({ error: 'Group chat already exists.' });
      }

      const newGroup = new chatModel({
        name,
        group: true,
        members,
        createdBy: firstUserId, // First user is the creator
      });

      const response = await newGroup.save();
      return res.status(200).json(response);
    } else {
      // Individual chat creation
      if (!firstUserId || !secondUserId) {
        return res
          .status(400)
          .json({ error: 'Both user IDs are required for individual chats.' });
      }

      const chat = await chatModel.findOne({
        members: { $all: [firstUserId, secondUserId] },
        group: false,
      });

      if (chat) return res.status(200).json(chat);

      const newChat = new chatModel({
        members: [firstUserId, secondUserId],
        group: false,
      });

      const response = await newChat.save();
      return res.status(200).json(response);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Failed to create chat.' });
  }
};

// Get all chats for a user
const findUserChats = async (req, res) => {
  const userId = req.params.userId;

  try {
    const chats = await chatModel.find({ members: { $in: [userId] } });
    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to retrieve user chats.' });
  }
};

// Get a single chat (individual or group)
const findChat = async (req, res) => {
  const { firstUserId, secondUserId, group, name } = req.query;

  try {
    if (group) {
      // Fetch a group chat by name and members
      const chat = await chatModel.findOne({
        group: true,
        name,
        members: { $all: [firstUserId, ...secondUserId] },
      });

      if (!chat) {
        return res.status(404).json({ error: 'Group chat not found.' });
      }

      return res.status(200).json(chat);
    } else {
      // Fetch an individual chat
      const chat = await chatModel.findOne({
        members: { $all: [firstUserId, secondUserId] },
        group: false,
      });

      if (!chat) {
        return res.status(404).json({ error: 'Individual chat not found.' });
      }

      return res.status(200).json(chat);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to retrieve chat.' });
  }
};

module.exports = {
  createChat,
  findUserChats,
  findChat,
};
