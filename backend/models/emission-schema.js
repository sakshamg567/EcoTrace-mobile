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
}, { _id: false }); // Prevent Mongoose from creating a separate _id for subdocuments


const Emission = mongoose.model(emission, emissionDataSchema)

module.exports = Emission;