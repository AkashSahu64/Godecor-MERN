const express = require('express');
const router = express.Router();
const {
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// Protected routes
router.route('/address')
  .post(protect, addUserAddress);

router.route('/address/:addressId')
  .put(protect, updateUserAddress)
  .delete(protect, deleteUserAddress);

router.route('/wishlist')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);

router.delete('/wishlist/:productId', protect, removeFromWishlist);

module.exports = router;