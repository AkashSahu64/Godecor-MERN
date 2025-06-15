const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Please add quantity'],
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
    ],
    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: Number,
      default: 0,
    },
    height: {
      type: String,
      required: [true, 'Please add the plant height'],
    },
    potSize: {
      type: String,
      required: [true, 'Please add the pot size'],
    },
    careLevel: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
    },
    lightRequirement: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    waterRequirement: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
  },
  {
    timestamps: true,
  }
);

// Calculate rating when a review is added
ProductSchema.methods.calcRating = function () {
  const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  this.rating = totalRating / this.reviews.length || 0;
  this.numReviews = this.reviews.length;
  return this.save();
};

module.exports = mongoose.model('Product', ProductSchema);