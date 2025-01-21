const messageModel = require('../models/messageModel');
const chatModel = require('../models/chatModel');

// Create a new message
const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;

  try {
    // Ensure the chat exists
    const chat = await chatModel.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found.' });
    }

    // Create and save the new message
    const newMessage = new messageModel({
      chatId,
      senderId,
      text,
    });

    const response = await newMessage.save();

    // Update the chat's `updatedAt` field
    await chatModel.findByIdAndUpdate(chatId, { updatedAt: new Date() });

    res.status(200).json(response);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message.' });
  }
};

// Get all messages for a chat
const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    // Ensure the chat exists
    const chat = await chatModel.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found.' });
    }

    // Retrieve all messages for the chat
    const messages = await messageModel.find({ chatId }).sort({ createdAt: 1 }); // Sort by timestamp

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({ error: 'Failed to retrieve messages.' });
  }
};

// Delete a single message
const deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    // Find and delete the message
    const deletedMsg = await messageModel.findByIdAndDelete(messageId);
    if (!deletedMsg) {
      return res.status(404).json({ error: 'Message not found.' });
    }

    // Update the chat's `updatedAt` field
    const updatedChat = await chatModel.findByIdAndUpdate(
      deletedMsg.chatId,
      { updatedAt: new Date() }, // Update timestamp
      { new: true }, // Return the updated document
    );

    if (!updatedChat) {
      return res
        .status(404)
        .json({ error: 'Chat not found after deleting message.' });
    }

    res.status(200).json({
      message: 'Message deleted and chat updated.',
      deletedMessage: deletedMsg,
      updatedChat,
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message.' });
  }
};

module.exports = { createMessage, getMessages, deleteMessage };
