const Product = require('../models/Product');
const Category = require('../models/Category');
const { cloudinaryUploadImage, cloudinaryDeleteImage } = require('../config/cloudinary');
const slugify = require('../utils/slugify');
const fs = require('fs');

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      quantity,
      height,
      potSize,
      careLevel,
      lightRequirement,
      waterRequirement,
      featured,
      discount,
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category || !quantity || !height || !potSize) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields',
      });
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Create slug from name
    const slug = slugify(name);

    // Check if product with same slug exists
    const productExists = await Product.findOne({ slug });
    if (productExists) {
      return res.status(400).json({
        success: false,
        message: 'Product with this name already exists',
      });
    }

    // Create product without images first
    const product = await Product.create({
      name,
      slug,
      description,
      price,
      category,
      quantity,
      height,
      potSize,
      careLevel: careLevel || 'easy',
      lightRequirement: lightRequirement || 'medium',
      waterRequirement: waterRequirement || 'medium',
      featured: featured || false,
      discount: discount || 0,
      images: [],
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Upload product images
// @route   PUT /api/products/:id/upload
// @access  Private/Admin
const uploadProductImages = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if files are provided
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one image',
      });
    }

    // Find product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Upload images to cloudinary
    const uploadPromises = req.files.map(async (file) => {
      const result = await cloudinaryUploadImage(file.path);
      // Remove file from server after upload
      fs.unlinkSync(file.path);
      return result;
    });

    const uploadedImages = await Promise.all(uploadPromises);

    // Add new images to product
    product.images = [...product.images, ...uploadedImages];
    await product.save();

    res.status(200).json({
      success: true,
      images: product.images,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    // Extract query parameters
    const { 
      keyword, 
      category, 
      minPrice, 
      maxPrice, 
      minRating,
      sort,
      page = 1, 
      limit = 10,
      featured
    } = req.query;

    // Build query
    const query = {};

    // Search by keyword in name or description
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Filter by category
    if (category) {
      // Check if it's a valid category ID
      const categoryObj = await Category.findOne({
        $or: [
          { _id: category },
          { slug: category }
        ]
      });
      
      if (categoryObj) {
        query.category = categoryObj._id;
      }
    }

    // Filter by price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    // Filter by rating
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // Filter featured products
    if (featured === 'true') {
      query.featured = true;
    }

    // Set up pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Set up sorting
    let sortOptions = { createdAt: -1 }; // Default sort by newest
    
    if (sort) {
      switch (sort) {
        case 'price-asc':
          sortOptions = { price: 1 };
          break;
        case 'price-desc':
          sortOptions = { price: -1 };
          break;
        case 'name-asc':
          sortOptions = { name: 1 };
          break;
        case 'name-desc':
          sortOptions = { name: -1 };
          break;
        case 'rating-desc':
          sortOptions = { rating: -1 };
          break;
        case 'popular':
          sortOptions = { sold: -1 };
          break;
        default:
          sortOptions = { createdAt: -1 };
      }
    }

    // Execute query with pagination
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOptions)
      .limit(limitNum)
      .skip(skip);

    // Get total count for pagination
    const count = await Product.countDocuments(query);

    res.json({
      success: true,
      count,
      pages: Math.ceil(count / limitNum),
      currentPage: pageNum,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get product by ID or slug
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find product by ID or slug
    const product = await Product.findOne({
      $or: [
        { _id: id },
        { slug: id }
      ]
    }).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      category,
      quantity,
      height,
      potSize,
      careLevel,
      lightRequirement,
      waterRequirement,
      featured,
      discount,
    } = req.body;

    // Find product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // If name is changing, update slug too
    let updatedSlug = product.slug;
    if (name && name !== product.name) {
      updatedSlug = slugify(name);
      
      // Check if new slug already exists (but not for this product)
      const slugExists = await Product.findOne({ 
        slug: updatedSlug,
        _id: { $ne: id } 
      });
      
      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: 'Product with this name already exists',
        });
      }
    }

    // Update product fields
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: name || product.name,
        slug: updatedSlug,
        description: description || product.description,
        price: price || product.price,
        category: category || product.category,
        quantity: quantity || product.quantity,
        height: height || product.height,
        potSize: potSize || product.potSize,
        careLevel: careLevel || product.careLevel,
        lightRequirement: lightRequirement || product.lightRequirement,
        waterRequirement: waterRequirement || product.waterRequirement,
        featured: featured !== undefined ? featured : product.featured,
        discount: discount !== undefined ? discount : product.discount,
      },
      { new: true }
    ).populate('category', 'name slug');

    res.json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Delete all product images from cloudinary
    if (product.images.length > 0) {
      const deletePromises = product.images.map(image => 
        cloudinaryDeleteImage(image.public_id)
      );
      await Promise.all(deletePromises);
    }

    // Delete product
    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product removed',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    // Validate input
    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please add a rating and comment',
      });
    }

    // Find product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'Product already reviewed',
      });
    }

    // Create review object
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    // Add review to product
    product.reviews.push(review);
    
    // Update product rating
    await product.calcRating();

    res.status(201).json({
      success: true,
      message: 'Review added',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  createProductReview,
};