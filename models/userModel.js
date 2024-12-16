const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minLength: 3 },
    email: { type: String, required: true, minLength: 3, unique: true },
    password: { type: String, required: true, minLength: 3 },
  },
  { timestamps: true },
);

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
