const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  getUserById,
  toggleBlockUser,
  getDashboardStats,
} = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');

// Protected admin routes
router.use(protect, isAdmin);

// Orders
router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);

// Users
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/block', toggleBlockUser);

// Dashboard
router.get('/dashboard', getDashboardStats);

module.exports = router;