const Patient = require('../models/Patient');

exports.createPatient = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      medicalConditions,
      mobilityStatus,
      emergencyContact
    } = req.body;

    if (!name || !age) {
      return res.status(400).json({ message: 'Name and age are required' });
    }

    const patient = await Patient.create({
      userId: req.user.id,
      name,
      age,
      gender,
      medicalConditions,
      mobilityStatus,
      emergencyContact
    });

    res.status(201).json(patient);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getMyPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const {
      name,
      age,
      gender,
      medicalConditions,
      mobilityStatus,
      emergencyContact
    } = req.body;

    patient.name = name ?? patient.name;
    patient.age = age ?? patient.age;
    patient.gender = gender ?? patient.gender;
    patient.medicalConditions = medicalConditions ?? patient.medicalConditions;
    patient.mobilityStatus = mobilityStatus ?? patient.mobilityStatus;
    patient.emergencyContact = emergencyContact ?? patient.emergencyContact;

    await patient.save();

    res.status(200).json(patient);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};