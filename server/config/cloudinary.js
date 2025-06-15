const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload image to cloudinary
const cloudinaryUploadImage = async (fileToUpload) => {
  try {
    const result = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: 'auto',
      folder: 'artificial-plants',
    });
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    throw new Error('Failed to upload image to Cloudinary');
  }
};

// Delete image from cloudinary
const cloudinaryDeleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return { message: 'Image deleted successfully' };
  } catch (error) {
    throw new Error('Failed to delete image from Cloudinary');
  }
};

module.exports = { cloudinaryUploadImage, cloudinaryDeleteImage };