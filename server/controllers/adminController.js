const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Get all orders for admin
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    // Extract query parameters
    const { 
      status, 
      page = 1, 
      limit = 10,
      sort = '-createdAt',
      startDate,
      endDate,
      search 
    } = req.query;

    // Build query
    const query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDateTime;
      }
    }

    // Search by order ID or user email/name
    if (search) {
      // First find users matching the search term
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }).select('_id');

      const userIds = users.map(user => user._id);

      // Update query to search by order ID or user
      query.$or = [
        { _id: { $regex: search, $options: 'i' } },
        { user: { $in: userIds } },
      ];
    }

    // Set up pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Set up sorting
    const sortOptions = {};
    if (sort.startsWith('-')) {
      sortOptions[sort.substring(1)] = -1;
    } else {
      sortOptions[sort] = 1;
    }

    // Execute query with pagination
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort(sortOptions)
      .limit(limitNum)
      .skip(skip);

    // Get total count for pagination
    const count = await Order.countDocuments(query);

    res.json({
      success: true,
      count,
      pages: Math.ceil(count / limitNum),
      currentPage: pageNum,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    // Valid status values
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Update status
    order.status = status;

    // If status is 'delivered', update isDelivered and deliveredAt
    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    // If status is changed back from 'delivered'
    if (status !== 'delivered' && order.isDelivered) {
      order.isDelivered = false;
      order.deliveredAt = null;
    }

    const updatedOrder = await order.save();

    res.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all users for admin
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    // Extract query parameters
    const { 
      page = 1, 
      limit = 10,
      sort = '-createdAt',
      search,
      isAdmin,
      isBlocked
    } = req.query;

    // Build query
    const query = {};

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by admin status
    if (isAdmin === 'true') {
      query.isAdmin = true;
    } else if (isAdmin === 'false') {
      query.isAdmin = false;
    }

    // Filter by blocked status
    if (isBlocked === 'true') {
      query.isBlocked = true;
    } else if (isBlocked === 'false') {
      query.isBlocked = false;
    }

    // Set up pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Set up sorting
    const sortOptions = {};
    if (sort.startsWith('-')) {
      sortOptions[sort.substring(1)] = -1;
    } else {
      sortOptions[sort] = 1;
    }

    // Execute query with pagination
    const users = await User.find(query)
      .select('-password')
      .sort(sortOptions)
      .limit(limitNum)
      .skip(skip);

    // Get total count for pagination
    const count = await User.countDocuments(query);

    res.json({
      success: true,
      count,
      pages: Math.ceil(count / limitNum),
      currentPage: pageNum,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Block/Unblock user
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    if (isBlocked === undefined) {
      return res.status(400).json({
        success: false,
        message: 'isBlocked field is required',
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent blocking yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot block yourself',
      });
    }

    user.isBlocked = isBlocked;
    await user.save();

    res.json({
      success: true,
      message: isBlocked ? 'User blocked successfully' : 'User unblocked successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // Get total orders count
    const totalOrders = await Order.countDocuments();
    
    // Get total revenue
    const revenueData = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;
    
    // Get total users count
    const totalUsers = await User.countDocuments();
    
    // Get total products sold
    const productsSoldData = await Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: '$orderItems' },
      { $group: { _id: null, totalSold: { $sum: '$orderItems.qty' } } },
    ]);
    const totalProductsSold = productsSoldData.length > 0 ? productsSoldData[0].totalSold : 0;
    
    // Get recent orders
    const recentOrders = await Order.find()
      .sort('-createdAt')
      .limit(5)
      .populate('user', 'name email')
      .select('_id totalPrice createdAt status isPaid');
    
    // Get order status counts
    const orderStatusCounts = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    
    const statusCounts = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    
    orderStatusCounts.forEach(item => {
      statusCounts[item._id] = item.count;
    });
    
    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        totalUsers,
        totalProductsSold,
        recentOrders,
        orderStatusCounts: statusCounts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  getUserById,
  toggleBlockUser,
  getDashboardStats,
};