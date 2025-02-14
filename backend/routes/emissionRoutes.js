// routes/emissionRoutes.js

const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const User = require('../models/user-schema');

// Get emission data for the last 7 days for a specific user
router.get('/:clerkUserId', requireAuth({}), async (req, res) => {
   try {
      const { clerkUserId } = req.params;
      
      // Find the user by clerkUserId
      const user = await User.findOne({ clerkUserId });

      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }

      // Get the current date
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to 00:00:00 for accurate date comparisons

      // Calculate the date 7 days ago
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6);

      // Aggregate the emission data for the last 7 days.
      const last7DaysEmissions = user.emissionsData.filter(entry => {
         const entryDate = new Date(entry.date);
         return entryDate >= sevenDaysAgo && entryDate <= today;
      });


      // Prepare the data in the format expected by the frontend
      const labels = [];
      const datasetData = [];

      for (let i = 0; i < 7; i++) {
         const date = new Date(sevenDaysAgo);
         date.setDate(sevenDaysAgo.getDate() + i);
         const dateString = date.toLocaleDateString('en-US', { weekday: 'short' });
         labels.push(dateString);

         // Find emission data for the current date
         const emissionEntry = last7DaysEmissions.find(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.toDateString() === date.toDateString();
         });

         // If data exists for the date, use it; otherwise, use 0
         datasetData.push(emissionEntry ? emissionEntry.emission_amount : 0);
      }

      const chartData = {
         labels: labels,
         datasets: [{ data: datasetData }],
      };

      res.json(chartData);
   } catch (error) {
      console.error('Error fetching emission data:', error);
      res.status(500).json({ message: 'Internal server error' });
   }
});

module.exports = router;