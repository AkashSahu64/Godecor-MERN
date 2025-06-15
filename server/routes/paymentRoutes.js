const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  updateOrderPayment,
} = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

// Protected routes
router.post('/razorpay/create', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);
router.put('/orders/:id/pay', protect, updateOrderPayment);

module.exports = router;