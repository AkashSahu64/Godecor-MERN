const express = require('express');
const router = express.Router();
const {
  getMonthlySales,
  getTopSellingProducts,
  getOrderStatusDistribution,
  getRevenuePerCategory,
  getSalesSummary,
} = require('../controllers/analyticsController');
const { protect } = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');

// Protected admin routes
router.use(protect, isAdmin);

router.get('/sales', getMonthlySales);
router.get('/top-products', getTopSellingProducts);
router.get('/order-status', getOrderStatusDistribution);
router.get('/category-revenue', getRevenuePerCategory);
router.get('/summary', getSalesSummary);

module.exports = router;