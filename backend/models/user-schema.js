// models/User.js
const mongoose = require('mongoose');

const emissionDataSchema = new mongoose.Schema({
   date: {
      type: Date,
      required: true,
   },
   emission_amount: {
      type: Number,
      required: true,
      default: 0, // Default to 0 emissions
   },
}, { _id: false });

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
   emissionsData: [emissionDataSchema], // Array of emission data entries
   // Add any other user-related fields here (e.g., name, profile picture URL, etc.)
}, { timestamps: true }, {_id: false}); // Add createdAt and updatedAt timestamps

const User = mongoose.model('User', userSchema);

module.exports = User;