import express from 'express';
import {
  authUser,
  registerUser,
  getUsers,
  updateUserStatus,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', authUser);
router.route('/:id/status').put(protect, admin, updateUserStatus);

export default router;