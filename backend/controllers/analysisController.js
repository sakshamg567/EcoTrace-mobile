// controllers/analysisController.js
const analysisModel = require('../models/analysisModel');

exports.analyzeImage = async (req, res) => {
   try {
      if (!req.file) {
         return res.status(400).json({ error: "No file uploaded" });
      }

      const analysisResult = await analysisModel.analyzeImage(req.file);

      // Success response
      res.json({
         message: "Image analyzed successfully",
         analysis: analysisResult,
      });

   } catch (error) {
      // Error handling (already includes file cleanup in the model)
      console.error("Error analyzing image:", error);  // Log the full error
      res.status(500).json({ error: "Failed to analyze image" });
   }
};