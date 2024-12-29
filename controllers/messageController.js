const messageModel = require('../models/messageModel');
const chatModel = require('../models/chatModel');

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

//Delete a single message
const deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    const deletedMsg = await messageModel.findByIdAndDelete(messageId);

    if (!deletedMsg) {
      return res.status(404).json({ error: 'Message not found.' });
    }

    // 2. Update the related chat's updatedAt timestamp
    //    This triggers Mongoose’s timestamps to set the `updatedAt` to now.
    //    If you need to store a "lastMessage" field or something else, you can do so here.
    const updatedChat = await chatModel.findByIdAndUpdate(
      deletedMsg.chatId,

      { new: true }, // returns the updated doc
    );

    if (!updatedChat) {
      return res
        .status(404)
        .json({ error: 'Chat not found after deleting message.' });
    }

    return res.status(200).json({
      message: 'Message deleted and chat updated.',
      deletedMessage: deletedMsg,
      updatedChat,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to delete message.' });
  }
};

module.exports = { createMessage, getMessages, deleteMessage };
