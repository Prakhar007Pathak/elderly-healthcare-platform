const Service = require("../models/Service");
const Caregiver = require('../models/Caregiver');

exports.verifyCaregiver = async (req, res) => {
  try {
    const caregiver = await Caregiver.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: 'verified' },
      { new: true }
    );

    if (!caregiver) {
      return res.status(404).json({ message: 'Caregiver not found' });
    }

    res.json({ message: 'Caregiver verified successfully', caregiver });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getPublicCaregiver = async (req, res) => {
  try {
    const caregiver = await Caregiver.findById(req.params.id)
      .populate("userId", "name email");

    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver not found" });
    }

    const services = await Service.find({
      caregiverId: caregiver._id,
      isActive: true
    });

    res.status(200).json({
      caregiver,
      services
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.createCaregiverProfile = async (req, res) => {
  try {
    const {
      qualification,
      experience,
      specialization,
      serviceAreas,
      availability
    } = req.body;

    const exists = await Caregiver.findOne({ userId: req.user.id });
    if (exists) {
      return res.status(400).json({
        message: 'Caregiver profile already exists'
      });
    }

    const caregiver = await Caregiver.create({
      userId: req.user.id,
      qualification,
      experience,
      specialization,
      serviceAreas,
      availability,
      verificationStatus: 'pending'
    });

    res.status(201).json(caregiver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
