// server.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require('cors');
const analysisRoutes = require('./routes/analysisRoutes');
const emissionRoutes = require('./routes/emissionRoutes')
const { ClerkExpressRequireAuth } = require('@clerk/express');
const mongoose = require("mongoose")



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist"))); // Serve static files

mongoose.connect(process.env.MONGO_DB_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

const User = require("./models/user-schema");
const { log } = require("console");

app.post('/api/webhooks/user', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        const evt = req.body;

        // Check for the event type (user.created, user.updated, etc.)
        if (evt.type === 'user.created') {
            const { id, email_addresses } = evt.data;
            log(id, email_addresses);
            // Create a new user in *your* database
            const newUser = new User({
                clerkUserId: id,
                email: email_addresses[0].email_address, // Assuming the first email is the primary
                emissionsData: [], // Start with an empty array of emission data
            });

            await newUser.save(); // Save the new user to the database
            console.log('New user created in database:', newUser);
            res.status(201).json(newUser); // Send a 201 Created response
        } else {
          // You might want to handle other events like user.updated or user.deleted
          console.log(`Received webhook event: ${evt.type}`);
          res.status(200).json({ message: 'Webhook received' });
        }


    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

// Routes
app.use('/api', analysisRoutes); // Use the analysis routes
app.use('/api/emissions', emissionRoutes);

// Serve index.html for root and redirect other routes (for SPA)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});
app.get("*", (req, res) => {
    res.redirect("/");
});

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));