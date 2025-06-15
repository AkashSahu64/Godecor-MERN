const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
} = require('../controllers/categoryController');
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
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Admin routes
router.post('/', protect, isAdmin, createCategory);
router.put('/:id', protect, isAdmin, updateCategory);
router.delete('/:id', protect, isAdmin, deleteCategory);
router.put(
  '/:id/upload',
  protect,
  isAdmin,
  upload.single('image'),
  uploadCategoryImage
);

module.exports = router;