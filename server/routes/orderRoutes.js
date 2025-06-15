const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getMyOrders,
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

// Protected routes
router.route('/')
  .post(protect, createOrder);

router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Razorpay routes
router.post('/create-razorpay-order', protect, createRazorpayOrder);
router.post('/verify-payment', protect, verifyRazorpayPayment);

module.exports = router;