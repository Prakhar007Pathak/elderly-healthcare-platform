const User = require('../models/User');
const Caregiver = require('../models/Caregiver');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');


// ================= GENERATE TOKEN =================
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};


// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, gender, dob } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      gender,
      dob,
      profileCompleted: role === 'elderly' ? false : role === 'caregiver' ? false : true
    });

    // Auto-create patient (elderly)
    if (role === 'elderly') {
      const age = dob
        ? Math.floor((Date.now() - new Date(dob)) / 31557600000)
        : null;

      await Patient.create({
        userId: user._id,
        name: user.name,
        age,
        gender,
        medicalConditions: [],
        mobilityStatus: '',
        emergencyContact: ''
      });
    }

    // Auto-create caregiver profile (empty)
    if (role === 'caregiver') {
      await Caregiver.create({
        userId: user._id,
        availability: true
      });
    }

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        profileCompleted: user.profileCompleted
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        profileCompleted: user.profileCompleted
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= GET ME =================
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let patientData = null;
    let caregiverData = null;

    if (user.role === "elderly") {
      patientData = await Patient.findOne({ userId: user._id });
    }

    if (user.role === "caregiver") {
      caregiverData = await Caregiver.findOne({ userId: user._id });
    }

    res.status(200).json({
      ...user.toObject(),
      patient: patientData,
      caregiver: caregiverData
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      gender,
      dob,
      address,

      // elderly
      medicalConditions,
      mobilityStatus,
      emergencyContact,

      // caregiver
      qualification,
      experience,
      specialization,
      serviceAreas,
      availability
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // -------- Update common fields --------
    user.name = name ?? user.name;
    user.phone = phone ?? user.phone;
    user.gender = gender ?? user.gender;
    user.dob = dob ?? user.dob;
    user.address = address ?? user.address;

    // ================= ELDERLY =================
    if (user.role === "elderly") {
      const patient = await Patient.findOne({ userId: user._id });

      if (patient) {
        patient.medicalConditions = medicalConditions || [];
        patient.mobilityStatus = mobilityStatus || "";
        patient.emergencyContact = emergencyContact || "";
        await patient.save();
      }

      // Mark completed if required fields exist
      if (user.address && patient?.mobilityStatus && patient?.emergencyContact) {
        user.profileCompleted = true;
      }
    }

    // ================= CAREGIVER =================
    if (user.role === "caregiver") {
      let caregiver = await Caregiver.findOne({ userId: user._id });

      if (!caregiver) {
        caregiver = await Caregiver.create({
          userId: user._id
        });
      }

      caregiver.qualification = qualification ?? caregiver.qualification;
      caregiver.experience = experience ?? caregiver.experience;
      caregiver.specialization = specialization ?? caregiver.specialization;
      caregiver.serviceAreas = serviceAreas ?? caregiver.serviceAreas;
      caregiver.availability = availability ?? caregiver.availability;

      await caregiver.save();

      if (
        caregiver.qualification &&
        caregiver.experience &&
        caregiver.specialization?.length > 0 &&
        caregiver.serviceAreas?.length > 0
      ) {
        user.profileCompleted = true;
      }
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};