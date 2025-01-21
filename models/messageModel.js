const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Chat model
      ref: 'Chat',
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    isGroupMessage: {
      type: Boolean,
      default: false, // Flag to indicate if this message is part of a group chat
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  },
);

const messageModel = mongoose.model('Message', messageSchema);

module.exports = messageModel;
