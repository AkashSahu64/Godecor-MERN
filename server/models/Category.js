const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
      maxlength: [32, 'Category name cannot exceed 32 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Category description is required'],
    },
    image: {
      url: {
        type: String,
        required: [true, 'Category image is required'],
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Category', CategorySchema);