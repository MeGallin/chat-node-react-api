const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const createToken = (_id) => {
  const jwtKey = process.env.JWT_SECRET_KEY;
  return jwt.sign({ _id }, jwtKey, { expiresIn: '120min' });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await userModel.findOne({ email });

    if (user) return res.status(400).json('User already exists...');
    if (!name || !email || !password)
      return res.status(400).json('All fields are required...');
    if (!validator.isEmail(email))
      return res.status(400).json('Email is invalid...');
    if (!validator.isStrongPassword(password))
      return res.status(400).json('The password must be a strong password');

    user = new userModel({ name, email, password });
    const salt = await bcrypt.genSalt(12);

    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    const token = createToken(user._id);
    res.status(200).json({ _id: user._id, name, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
module.exports = { registerUser };
