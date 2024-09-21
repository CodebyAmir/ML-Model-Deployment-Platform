const express = require('express');
const multer = require('multer');
const router = express.Router();
const modelController = require('../controllers/modelController');

// Configure file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './models/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});

const upload = multer({ storage });

// Routes
router.post('/upload', upload.single('model'), modelController.uploadModel);
router.post('/inference', modelController.runInference);
router.get('/metrics', modelController.getMetrics);

module.exports = router;
