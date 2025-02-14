// models/User.js
const mongoose = require('mongoose');
const Emission = require("./emission-schema")

const userSchema = new mongoose.Schema({
   clerkUserId: { // Use Clerk's User ID as the primary identifier
      type: String,
      required: true,
      unique: true, // Ensure User IDs are unique
      lowercase: true,
      trim: true,
   },
   email: {
      type: String,
      required: true,
      unique: true, // Ensure emails are unique
      lowercase: true, // Store emails in lowercase for consistency
      trim: true,     // Remove whitespace
   },
   emissionsData: [Emission], // Array of emission data entries
   // Add any other user-related fields here (e.g., name, profile picture URL, etc.)
}, { timestamps: true }, {_id: false}); // Add createdAt and updatedAt timestamps

const User = mongoose.model('User', userSchema);

module.exports = User;