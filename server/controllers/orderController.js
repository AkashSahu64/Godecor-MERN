const Order = require('../models/Order');
const Product = require('../models/Product');
const razorpayInstance = require('../config/razorpay');
const crypto = require('crypto');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items',
      });
    }

    // Check if all products exist and have sufficient quantity
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }
      
      if (product.quantity < item.qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient quantity for ${product.name}. Available: ${product.quantity}`,
        });
      }
    }

    // Create order
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    // If payment is made through Razorpay
    if (paymentMethod === 'razorpay' && razorpayOrderId && razorpayPaymentId && razorpaySignature) {
      // Verify Razorpay payment
      order.razorpayOrderId = razorpayOrderId;
      order.razorpayPaymentId = razorpayPaymentId;
      order.razorpaySignature = razorpaySignature;
      
      // Mark order as paid
      order.isPaid = true;
      order.paidAt = Date.now();
      order.status = 'processing';
      
      // Update product quantities and sold count
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { quantity: -item.qty, sold: +item.qty },
        });
      }
    }

    // Save order
    const createdOrder = await order.save();

    res.status(201).json({
      success: true,
      order: createdOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if the order belongs to the logged in user or if user is admin
    if (
      order.user._id.toString() !== req.user._id.toString() && 
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort('-createdAt');

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create Razorpay order
// @route   POST /api/orders/create-razorpay-order
// @access  Private
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an amount',
      });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    if (!order) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create Razorpay order',
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/orders/verify-payment
// @access  Private
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification parameters',
      });
    }

    // Generate signature for verification
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    // Verify signature
    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  createRazorpayOrder,
  verifyRazorpayPayment,
};