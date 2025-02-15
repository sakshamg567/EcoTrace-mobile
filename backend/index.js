// server.js (or index.js)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { clerkMiddleware } = require('@clerk/express'); //  SIMPLIFIED IMPORT
require('dotenv').config();
const analysisRoutes = require("./routes/analysisRoutes")
const path = require("path")

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

mongoose.connect(process.env.MONGO_DB_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

const User = require('./models/user-schema');

// Clerk Webhook Endpoint (Handles user creation)
app.post('/api/webhooks/user', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const evt = req.body;
    if (evt.type === 'user.created') {
      const { id, email_addresses } = evt.data;
      const newUser = new User({
        clerkUserId: id,
        email: email_addresses[0].email_address,
        emissionsData: [],
      });

      await newUser.save();
      console.log('New user created in database:', newUser);
      res.status(201).json(newUser);
    } else {
      console.log(`Received webhook event: ${evt.type}`);
      res.status(200).json({ message: 'Webhook received (ignored)' });
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Example protected route (authentication REQUIRED)
app.get('/api/protected', clerkMiddleware({ required: true }), (req, res) => {
  res.json({ message: 'Protected route', user: req.auth });
});

// Example route (authentication OPTIONAL)
app.get('/api/optional', clerkMiddleware(), (req, res) => { // No options = optional
  if (req.auth.userId) {
    res.json({ message: 'Authenticated', user: req.auth });
  } else {
    res.json({ message: 'Not authenticated' });
  }
});

// Example: Get user data (REQUIRED authentication)
app.get('/api/users/:clerkUserId', clerkMiddleware({ required: true }), async (req, res) => {
  try {
    const user = await User.findOne({ clerkUserId: req.params.clerkUserId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Example: Add emission data (REQUIRED authentication)
app.post('/api/users/:clerkUserId/emissions', clerkMiddleware({ required: true }), async (req, res) => {
  try {
    const { date, emission_amount } = req.body;

    if (!date || !emission_amount || typeof emission_amount !== 'number') {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const user = await User.findOne({ clerkUserId: req.params.clerkUserId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.emissionsData.push({
      date: new Date(date),
      emission_amount,
    });

    await user.save();
    res.status(201).json(user.emissionsData);
  } catch (error) {
    console.error("Error adding emission data:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const emissionRoutes = require('./routes/emissionRoutes');
app.use('/api/emissions', emissionRoutes);
app.use('/api/analyze', analysisRoutes);

app.get("/", (req,res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

app.get("*", (req,res) => {
  res.redirect("/")
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});