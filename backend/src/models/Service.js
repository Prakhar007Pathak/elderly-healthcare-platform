const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  caregiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Caregiver',
    required: true
  },

  name: {
    type: String,
    required: true
  },

  description: String,

  image: {
    type: String // Cloudinary URL
  },

  pricePerHour: {
    type: Number,
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);