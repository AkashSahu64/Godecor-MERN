const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  createProductReview,
} = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter for images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
});

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes
router.post('/:id/reviews', protect, createProductReview);

// Admin routes
router.post('/', protect, isAdmin, createProduct);
router.put('/:id', protect, isAdmin, updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);
router.put(
  '/:id/upload',
  protect,
  isAdmin,
  upload.array('images', 5),
  uploadProductImages
);

module.exports = router;