const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get monthly sales data for the past 12 months
// @route   GET /api/analytics/sales
// @access  Private/Admin
const getMonthlySales = async (req, res) => {
  try {
    // Get current date
    const currentDate = new Date();
    
    // Set to beginning of current month
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    
    // Set to 12 months ago
    const startDate = new Date(
      endDate.getFullYear(),
      endDate.getMonth() - 12,
      1
    );

    // Aggregate monthly sales
    const monthlySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lt: currentDate },
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalSales: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    // Format data for chart.js
    const months = [];
    const salesData = [];
    const orderCountData = [];

    // Create a map of all 12 months with initial values
    const salesMap = new Map();
    const orderCountMap = new Map();

    for (let i = 0; i < 12; i++) {
      const date = new Date(startDate);
      date.setMonth(startDate.getMonth() + i);
      
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      
      const monthKey = `${year}-${month}`;
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      salesMap.set(monthKey, 0);
      orderCountMap.set(monthKey, 0);
      months.push(monthName);
    }

    // Fill in actual data
    monthlySales.forEach(item => {
      const year = item._id.year;
      const month = item._id.month;
      const monthKey = `${year}-${month}`;

      salesMap.set(monthKey, item.totalSales);
      orderCountMap.set(monthKey, item.orderCount);
    });

    // Convert maps to arrays for chart.js
    salesMap.forEach(value => {
      salesData.push(value);
    });

    orderCountMap.forEach(value => {
      orderCountData.push(value);
    });

    res.json({
      success: true,
      data: {
        labels: months,
        salesData,
        orderCountData,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get top selling products
// @route   GET /api/analytics/top-products
// @access  Private/Admin
const getTopSellingProducts = async (req, res) => {
  try {
    // Get top 5 selling products
    const topProducts = await Product.aggregate([
      {
        $sort: { sold: -1 },
      },
      {
        $limit: 8,
      },
      {
        $project: {
          _id: 1,
          name: 1,
          sold: 1,
          price: 1,
        },
      },
    ]);

    // Format data for charts
    const labels = topProducts.map(product => product.name);
    const data = topProducts.map(product => product.sold);
    const revenue = topProducts.map(product => product.sold * product.price);

    res.json({
      success: true,
      topProducts,
      chartData: {
        labels,
        soldData: data,
        revenueData: revenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get order status distribution
// @route   GET /api/analytics/order-status
// @access  Private/Admin
const getOrderStatusDistribution = async (req, res) => {
  try {
    const orderStatusCounts = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Format data for doughnut chart
    const labels = [];
    const data = [];

    // Create a map of all statuses with initial values
    const statusMap = {
      'pending': 0,
      'processing': 0,
      'shipped': 0,
      'delivered': 0,
      'cancelled': 0,
    };

    // Fill in actual data
    orderStatusCounts.forEach(item => {
      statusMap[item._id] = item.count;
    });

    // Convert to arrays for chart.js
    Object.keys(statusMap).forEach(status => {
      labels.push(status.charAt(0).toUpperCase() + status.slice(1));
      data.push(statusMap[status]);
    });

    res.json({
      success: true,
      chartData: {
        labels,
        data,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get revenue per category
// @route   GET /api/analytics/category-revenue
// @access  Private/Admin
const getRevenuePerCategory = async (req, res) => {
  try {
    // Get all paid orders
    const orders = await Order.find({ isPaid: true })
      .populate({
        path: 'orderItems.product',
        select: 'category',
        populate: {
          path: 'category',
          select: 'name',
        },
      });

    // Calculate revenue per category
    const categoryRevenueMap = new Map();

    orders.forEach(order => {
      order.orderItems.forEach(item => {
        if (item.product && item.product.category) {
          const categoryId = item.product.category._id.toString();
          const categoryName = item.product.category.name;
          const itemRevenue = item.price * item.qty;

          if (categoryRevenueMap.has(categoryId)) {
            const current = categoryRevenueMap.get(categoryId);
            categoryRevenueMap.set(categoryId, {
              name: categoryName,
              revenue: current.revenue + itemRevenue,
            });
          } else {
            categoryRevenueMap.set(categoryId, {
              name: categoryName,
              revenue: itemRevenue,
            });
          }
        }
      });
    });

    // Convert map to array and sort by revenue
    const categoryRevenue = Array.from(categoryRevenueMap.entries())
      .map(([id, data]) => ({
        categoryId: id,
        name: data.name,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    // Format data for chart.js
    const labels = categoryRevenue.map(item => item.name);
    const data = categoryRevenue.map(item => item.revenue);

    res.json({
      success: true,
      categoryRevenue,
      chartData: {
        labels,
        data,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get overall sales summary
// @route   GET /api/analytics/summary
// @access  Private/Admin
const getSalesSummary = async (req, res) => {
  try {
    // Get total orders count
    const totalOrders = await Order.countDocuments();
    
    // Get total revenue
    const revenueData = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;
    
    // Get average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Get today's orders and revenue
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });
    
    const todayRevenueData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: todayStart, $lte: todayEnd },
          isPaid: true,
        },
      },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const todayRevenue = todayRevenueData.length > 0 ? todayRevenueData[0].total : 0;
    
    // Get total products sold
    const productsSoldData = await Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: '$orderItems' },
      { $group: { _id: null, totalSold: { $sum: '$orderItems.qty' } } },
    ]);
    const totalProductsSold = productsSoldData.length > 0 ? productsSoldData[0].totalSold : 0;
    
    res.json({
      success: true,
      summary: {
        totalOrders,
        totalRevenue,
        avgOrderValue,
        todayOrders,
        todayRevenue,
        totalProductsSold,
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
  getMonthlySales,
  getTopSellingProducts,
  getOrderStatusDistribution,
  getRevenuePerCategory,
  getSalesSummary,
};