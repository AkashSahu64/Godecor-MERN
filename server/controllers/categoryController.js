const Category = require('../models/Category');
const Product = require('../models/Product');
const slugify = require('../utils/slugify');
const { cloudinaryUploadImage, cloudinaryDeleteImage } = require('../config/cloudinary');
const fs = require('fs');

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name, description, featured } = req.body;

    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide category name and description',
      });
    }

    // Check if category with same name exists
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists',
      });
    }

    // Create slug from name
    const slug = slugify(name);

    // Create category without image first
    const category = await Category.create({
      name,
      slug,
      description,
      featured: featured || false,
      image: {
        url: '',
        public_id: '',
      },
    });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Upload category image
// @route   PUT /api/categories/:id/upload
// @access  Private/Admin
const uploadCategoryImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if file is provided
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image',
      });
    }

    // Find category
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Delete previous image if exists
    if (category.image && category.image.public_id) {
      await cloudinaryDeleteImage(category.image.public_id);
    }

    // Upload image to cloudinary
    const result = await cloudinaryUploadImage(req.file.path);
    
    // Remove file from server after upload
    fs.unlinkSync(req.file.path);

    // Update category with new image
    category.image = {
      url: result.url,
      public_id: result.public_id,
    };
    
    await category.save();

    res.status(200).json({
      success: true,
      image: category.image,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    // Extract query parameters
    const { featured } = req.query;

    // Build query
    const query = {};

    // Filter featured categories
    if (featured === 'true') {
      query.featured = true;
    }

    const categories = await Category.find(query).sort('name');

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get category by ID or slug
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find category by ID or slug
    const category = await Category.findOne({
      $or: [
        { _id: id },
        { slug: id }
      ]
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, featured } = req.body;

    // Find category
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // If name is changing, update slug too
    let updatedSlug = category.slug;
    if (name && name !== category.name) {
      updatedSlug = slugify(name);
      
      // Check if new slug already exists (but not for this category)
      const slugExists = await Category.findOne({ 
        slug: updatedSlug,
        _id: { $ne: id } 
      });
      
      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists',
        });
      }
    }

    // Update category fields
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name: name || category.name,
        slug: updatedSlug,
        description: description || category.description,
        featured: featured !== undefined ? featured : category.featured,
      },
      { new: true }
    );

    res.json({
      success: true,
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find category
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Check if any products are using this category
    const productsWithCategory = await Product.countDocuments({ category: id });
    if (productsWithCategory > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It's associated with ${productsWithCategory} products.`,
      });
    }

    // Delete category image from cloudinary
    if (category.image && category.image.public_id) {
      await cloudinaryDeleteImage(category.image.public_id);
    }

    // Delete category
    await category.deleteOne();

    res.json({
      success: true,
      message: 'Category removed',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
};