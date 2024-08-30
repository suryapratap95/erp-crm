const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const { generate: uniqueId } = require('shortid');

const register = async (req, res, { userModel }) => {
  const User = mongoose.model(userModel);
  const UserPassword = mongoose.model(userModel + 'Password');
  const { email, password, name } = req.body;

  // Validate input
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  const { error } = schema.validate({ name, email, password });
  if (error) {
    return res.status(400).json({
      success: false,
      result: null,
      message: error.details[0].message,
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email, removed: false });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      result: null,
      message: 'An account with this email already exists.',
    });
  }

  // Create new user
  const newUser = new User({
    email,
    name,
    role: 'user', // Assign default role
  });

  const salt = uniqueId();
  const hashedPassword = bcrypt.hashSync(salt + password);

  const savedUser = await newUser.save();

  // Create user password entry
  await new UserPassword({
    user: savedUser._id,
    password: hashedPassword,
    salt,
    emailVerified: false,
  }).save();

  // Generate JWT token
  const token = jwt.sign(
    { id: savedUser._id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.status(201).json({
    success: true,
    result: {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
    },
    message: 'User registered successfully',
    token,
  });
};

module.exports = register;