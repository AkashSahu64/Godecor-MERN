import express from 'express';
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, admin, getAllOrders);
router.get('/myorders', protect, getUserOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

export default router;