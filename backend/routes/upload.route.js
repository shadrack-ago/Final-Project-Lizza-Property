import express from 'express';
import multer from 'multer';
import { uploadImages } from '../controllers/upload.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 6 // Maximum 6 files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

router.post('/images', verifyToken, upload.array('images', 6), uploadImages);

export default router;
