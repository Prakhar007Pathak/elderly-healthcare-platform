const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['family', 'elderly', 'caregiver', 'admin'],
    default: 'family'
  },

  phone: {
    type: String
  },

  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },

  dob: {
    type: Date
  },

  address: {
    type: String
  },

  profileCompleted: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
