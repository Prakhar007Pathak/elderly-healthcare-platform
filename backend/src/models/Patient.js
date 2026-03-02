const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: String,
  age: Number,
  gender: String,
  medicalConditions: [String],
  mobilityStatus: String,
  emergencyContact: String
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);