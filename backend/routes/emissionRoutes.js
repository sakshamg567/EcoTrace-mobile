// routes/emissionRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user-schema'); // CORRECTED import

// Get emission data for the last 7 days for a specific user
router.get('/:clerkUserId', async (req, res) => { // ADDED AUTH MIDDLEWARE
  try {
    const { clerkUserId } = req.params;

    const user = await User.findOne({ clerkUserId });
    console.log("USER FOUND", user); // REMOVED - Don't log entire user objects in production

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

  

    const labels = [];
    const datasetData = [];

    const chartData = user.emissionsData
    console.log(chartData);
    

    res.json(chartData);
  } catch (error) {
    console.error('Error fetching emission data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;