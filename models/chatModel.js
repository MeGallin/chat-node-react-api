const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    members: {
      type: [mongoose.Schema.Types.ObjectId], // Store member IDs as ObjectId references
      ref: 'User', // Reference the User model
      required: true,
    },
    group: {
      type: Boolean,
      default: false, // Indicates whether the chat is a group chat
    },
    name: {
      type: String,
      required: function () {
        return this.group; // Group chats require a name
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, // User who created the group
      ref: 'User',
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  },
);

const chatModel = mongoose.model('Chat', chatSchema);

module.exports = chatModel;
