// routes/analysisRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const analysisController = require('../controllers/analysisController');

// Define the /analyze route, using multer for file uploads and the controller
router.post('/', upload.single('image'), analysisController.analyzeImage);

module.exports = router;