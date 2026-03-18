const User = require('../models/User');
const Caregiver = require('../models/Caregiver');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const crypto = require("crypto");
const sendVerificationEmail = require("../utils/sendVerificationEmail");
const EmailVerification = require("../models/EmailVerification");


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

    // Check if email was verified
    const verification = await EmailVerification.findOne({ email });

    if (!verification || !verification.verified) {
      return res.status(400).json({
        message: "Please verify your email before registering"
      });
    }

    // Prevent duplicate accounts
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Phone validation (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;

    if (phone && !phoneRegex.test(phone)) {
      return res.status(400).json({
        message: "Invalid phone number format"
      });
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
      profileCompleted:
        role === "elderly"
          ? false
          : role === "caregiver"
            ? false
            : true
    });

    // ================= ELDERLY =================
    if (role === "elderly") {

      const age = dob
        ? Math.floor((Date.now() - new Date(dob)) / 31557600000)
        : null;

      await Patient.create({
        userId: user._id,
        name: user.name,
        age,
        gender,
        medicalConditions: [],
        mobilityStatus: "",
        emergencyContact: ""
      });

    }

    // ================= CAREGIVER =================
    if (role === "caregiver") {

      await Caregiver.create({
        userId: user._id,
        availability: true
      });

    }

    // Remove verification record after successful registration
    await EmailVerification.deleteOne({ email });

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
    res.status(500).json({
      message: err.message
    });
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


// ================= VERIFY EMAIL =================
exports.verifyEmail = async (req, res) => {
  try {

    const { token } = req.params;

    const record = await EmailVerification.findOne({ token });

    if (!record) {
      return res.status(400).json({
        message: "Invalid or expired verification link"
      });
    }

    record.verified = true;
    await record.save();

    res.redirect(`${process.env.CLIENT_URL}/verify-success`);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= SEND VERIFICATION EMAIL =================
exports.sendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const token = crypto.randomBytes(32).toString("hex");

    await EmailVerification.findOneAndUpdate(
      { email },
      {
        email,
        token,
        verified: false
      },
      { upsert: true, new: true }
    );

    await sendVerificationEmail(email, token);

    res.json({ message: "Verification email sent" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= CHECK EMAIL VERIFICATION =================
exports.checkEmailVerification = async (req, res) => {
  try {

    const { email } = req.params;

    const record = await EmailVerification.findOne({ email });

    if (!record) {
      return res.json({ verified: false });
    }

    res.json({
      verified: record.verified
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
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

    user.name = name ?? user.name;
    user.phone = phone ?? user.phone;
    user.gender = gender ?? user.gender;
    user.dob = dob ?? user.dob;
    user.address = address ?? user.address;

    user.profileCompleted = false;

    // ================= ELDERLY =================
    if (user.role === "elderly") {

      let patient = await Patient.findOne({ userId: user._id });

      if (patient) {
        patient.medicalConditions = medicalConditions || [];
        patient.mobilityStatus = mobilityStatus || "";
        patient.emergencyContact = emergencyContact || "";
        await patient.save();
      }

      if (
        user.address &&
        patient?.mobilityStatus &&
        patient?.emergencyContact
      ) {
        user.profileCompleted = true;
      }
    }

    // ================= FAMILY =================
    if (user.role === "family") {

      const patients = await Patient.find({ userId: user._id });

      if (patients.length > 0) {
        user.profileCompleted = true;
      }
    }

    // ================= CAREGIVER =================
    if (user.role === "caregiver") {

      const Booking = require("../models/Booking");

      let caregiver = await Caregiver.findOne({ userId: user._id });

      if (!caregiver) {
        caregiver = await Caregiver.create({
          userId: user._id
        });
      }

      if (availability === false) {

        const activeJob = await Booking.findOne({
          caregiverId: caregiver._id,
          status: { $in: ["accepted", "ongoing"] }
        });

        if (activeJob) {
          return res.status(400).json({
            message: "You cannot mark yourself unavailable while a job is active"
          });
        }
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