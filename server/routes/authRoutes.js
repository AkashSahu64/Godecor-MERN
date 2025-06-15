const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  updateUserProfile,
  getUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;