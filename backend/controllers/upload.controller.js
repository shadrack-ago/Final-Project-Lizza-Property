import { v2 as cloudinary } from 'cloudinary';
import { errorHandler } from '../utils/error.js';

// Configure Cloudinary
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

export const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next(errorHandler(400, 'No files uploaded'));
    }

    if (req.files.length > 6) {
      return next(errorHandler(400, 'You can only upload 6 images per listing'));
    }

    const uploadPromises = req.files.map(async (file) => {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size should be less than 5MB');
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'real-estate-listings',
          transformation: [
            { width: 1000, height: 1000, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) throw error;
          return result;
        }
      );

      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'real-estate-listings',
            transformation: [
              { width: 1000, height: 1000, crop: 'limit' },
              { quality: 'auto' }
            ]
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          }
        );
        stream.end(file.buffer);
      });
    });

    const imageUrls = await Promise.all(uploadPromises);
    
    res.status(200).json({
      success: true,
      imageUrls
    });

  } catch (error) {
    next(errorHandler(500, error.message || 'Image upload failed'));
  }
};
