const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'User already exists',
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
  });

  if (user) {
    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid user data',
    });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  // Check if user is blocked
  if (user.isBlocked) {
    return res.status(403).json({
      success: false,
      message: 'Your account has been blocked. Please contact admin.',
    });
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    },
  });
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Find user by id
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Update user fields if provided
  user.name = name || user.name;
  user.email = email || user.email;
  user.phone = phone || user.phone;
  
  if (password) {
    user.password = password;
  }

  const updatedUser = await user.save();

  res.json({
    success: true,
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    },
  });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        addresses: user.addresses,
        wishlist: user.wishlist,
      },
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUserProfile,
  getUserProfile,
};