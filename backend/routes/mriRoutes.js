const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { analyzeMRI, getMRIHistory, uploadMRI } = require('../controllers/mriController');
const { protect } = require('../middleware/authMiddleware');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/dicom',
    'application/pdf', 'application/dicom',
    'application/octet-stream', // for .dcm files
  ];
  const allowedExts = ['.jpg', '.jpeg', '.png', '.pdf', '.dcm', '.dicom'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(file.mimetype) || allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype} (${ext})`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

// Protect all MRI routes
router.use(protect);

/**
 * @route   POST /api/mri/analyze
 * @desc    Analyze a medical scan (image upload or blood report JSON)
 * @access  Private
 */
router.post('/analyze', upload.single('file'), analyzeMRI);

/**
 * @route   GET /api/mri/history
 * @desc    Get user's MRI analysis history
 * @access  Private
 */
router.get('/history', getMRIHistory);

/**
 * @route   POST /api/mri/upload
 * @desc    Upload MRI file
 * @access  Private
 */
router.post('/upload', upload.single('file'), uploadMRI);

module.exports = router;
