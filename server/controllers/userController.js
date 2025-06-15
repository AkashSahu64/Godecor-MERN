const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Add address to user profile
// @route   POST /api/users/address
// @access  Private
const addUserAddress = async (req, res) => {
  try {
    const {
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    // Validate required fields
    if (!addressLine1 || !city || !state || !postalCode || !country) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required address fields',
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Create new address object
    const newAddress = {
      addressLine1,
      addressLine2: addressLine2 || '',
      city,
      state,
      postalCode,
      country,
      isDefault: isDefault || false,
    };

    // If the new address is set as default, unset any existing default
    if (newAddress.isDefault) {
      user.addresses.forEach((address) => {
        address.isDefault = false;
      });
    }

    // Add the new address
    user.addresses.push(newAddress);

    // If this is the first address, set it as default
    if (user.addresses.length === 1) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(201).json({
      success: true,
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user address
// @route   PUT /api/users/address/:addressId
// @access  Private
const updateUserAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const {
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Find the address to update
    const addressIndex = user.addresses.findIndex(
      (address) => address._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    // Update address fields
    if (addressLine1) user.addresses[addressIndex].addressLine1 = addressLine1;
    if (addressLine2 !== undefined) user.addresses[addressIndex].addressLine2 = addressLine2;
    if (city) user.addresses[addressIndex].city = city;
    if (state) user.addresses[addressIndex].state = state;
    if (postalCode) user.addresses[addressIndex].postalCode = postalCode;
    if (country) user.addresses[addressIndex].country = country;

    // Handle default address
    if (isDefault) {
      // Set all addresses to not default
      user.addresses.forEach((address, index) => {
        user.addresses[index].isDefault = false;
      });
      // Set the current address as default
      user.addresses[addressIndex].isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete user address
// @route   DELETE /api/users/address/:addressId
// @access  Private
const deleteUserAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Find the address to delete
    const addressIndex = user.addresses.findIndex(
      (address) => address._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    // Check if the address being deleted is the default one
    const isDefault = user.addresses[addressIndex].isDefault;

    // Remove the address
    user.addresses.splice(addressIndex, 1);

    // If the deleted address was the default and there are other addresses,
    // set the first one as default
    if (isDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/users/wishlist
// @access  Private
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if product is already in wishlist
    const alreadyInWishlist = user.wishlist.includes(productId);
    
    if (alreadyInWishlist) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist',
      });
    }

    // Add to wishlist
    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({
      success: true,
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if product is in wishlist
    const wishlistIndex = user.wishlist.findIndex(
      (id) => id.toString() === productId
    );

    if (wishlistIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in wishlist',
      });
    }

    // Remove from wishlist
    user.wishlist.splice(wishlistIndex, 1);
    await user.save();

    res.json({
      success: true,
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('wishlist', 'name price images slug rating numReviews');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};