const User = require('../models/User');
const Booking = require('../models/Booking');
const Patient = require('../models/Patient');
const Service = require('../models/Service');
const Caregiver = require('../models/Caregiver');

// ---------------- CREATE BOOKING ----------------
exports.createBooking = async (req, res) => {
  try {
    const { patientId, serviceId, startDate, hoursPerDay, durationDays } = req.body;

    if (!patientId || !serviceId || !startDate || !hoursPerDay || !durationDays) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findById(req.user.id);

    if (!user || !user.profileCompleted) {
      return res.status(400).json({
        message: "Please complete your profile before booking a service"
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);

    if (start < today) {
      return res.status(400).json({
        message: "Start date must be today or future date"
      });
    }

    const patient = await Patient.findOne({
      _id: patientId,
      userId: req.user.id
    });

    if (!patient) {
      return res.status(403).json({
        message: 'Patient not found or does not belong to this user'
      });
    }

    const service = await Service.findById(serviceId)
      .populate({
        path: "caregiverId",
        populate: { path: "userId" }
      });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const endDate = new Date(start);
    endDate.setDate(endDate.getDate() + durationDays);

    const totalCost =
      service.pricePerHour * hoursPerDay * durationDays;

    const booking = await Booking.create({
      userId: req.user.id,
      patientId,
      caregiverId: service.caregiverId._id,
      serviceId,
      startDate: start,
      endDate,
      hoursPerDay,
      durationDays,
      pricePerHour: service.pricePerHour,
      totalCost,
      status: 'requested'
    });

    if (global.io) {
      global.io.to(service.caregiverId.userId._id.toString()).emit("notification", {
        type: "new-booking",
        message: "New booking request received",
        booking
      });
    }

    global.io.emit("booking-updated", booking);

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};


// ---------------- GET FAMILY BOOKINGS ----------------
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user.id
    })
      .populate('patientId', 'name age')
      .populate('serviceId', 'name pricePerHour')
      .populate({
        path: 'caregiverId',
        populate: {
          path: 'userId',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ---------------- GET CAREGIVER PENDING ----------------
exports.getPendingBookings = async (req, res) => {
  try {

    const caregiver = await Caregiver.findOne({ userId: req.user.id });

    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver profile not found" });
    }

    const bookings = await Booking.find({
      caregiverId: caregiver._id,
      status: 'requested'
    })
      .populate('patientId', 'name age emergencyContact')
      .populate({
        path: 'serviceId',
        select: 'name pricePerHour'
      })
      .sort({ createdAt: 1 });

    res.status(200).json(bookings);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ---------------- ACCEPT BOOKING ----------------
exports.acceptBooking = async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'requested') {
      return res.status(400).json({ message: 'Booking already processed' });
    }

    const caregiver = await Caregiver.findOne({ userId: req.user.id });

    if (!caregiver) {
      return res.status(403).json({
        message: "Please complete your caregiver profile first"
      });
    }

    if (caregiver.verificationStatus !== "verified") {
      return res.status(403).json({
        message: "Your profile is not verified by admin yet"
      });
    }

    if (!caregiver.availability) {
      return res.status(403).json({
        message: "You are currently marked as unavailable"
      });
    }

    booking.caregiverId = caregiver._id;
    booking.status = 'accepted';

    await booking.save();

    // 🔔 NOTIFY USER
    if (global.io) {
      global.io.to(booking.userId.toString()).emit("notification", {
        type: "booking-accepted",
        message: "Your booking has been accepted",
        booking
      });
    }

    global.io.emit("booking-updated", booking);

    res.status(200).json({
      message: 'Booking accepted successfully',
      booking
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ---------------- UPDATE STATUS ----------------
exports.updateBookingStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const caregiver = await Caregiver.findOne({ userId: req.user.id });

    if (!caregiver) {
      return res.status(403).json({ message: 'Caregiver profile not found' });
    }

    if (
      !booking.caregiverId ||
      booking.caregiverId.toString() !== caregiver._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized for this booking' });
    }

    const allowedTransitions = {
      accepted: ['ongoing'],
      ongoing: ['completed']
    };

    if (
      !allowedTransitions[booking.status] ||
      !allowedTransitions[booking.status].includes(status)
    ) {
      return res.status(400).json({
        message: `Invalid status transition`
      });
    }

    booking.status = status;
    await booking.save();

    // 🔔 NOTIFY USER ABOUT STATUS CHANGE
    if (global.io) {

      if (status === "ongoing") {
        global.io.to(booking.userId.toString()).emit("notification", {
          type: "job-started",
          message: "Caregiver started your service",
          booking
        });
      }

      if (status === "completed") {
        global.io.to(booking.userId.toString()).emit("notification", {
          type: "job-completed",
          message: "Service completed. You can now rate the caregiver.",
          booking
        });
      }
    }

    global.io.emit("booking-updated", booking);

    res.status(200).json({
      message: 'Booking status updated successfully',
      booking
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ---------------- CAREGIVER JOBS ----------------
exports.getMyJobs = async (req, res) => {
  try {

    const caregiver = await Caregiver.findOne({ userId: req.user.id });

    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver profile not found" });
    }

    const jobs = await Booking.find({
      caregiverId: caregiver._id
    })
      .populate('patientId', 'name age emergencyContact')
      .populate('serviceId', 'name pricePerHour')
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ---------------- CANCEL BOOKING ----------------
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (["completed", "cancelled"].includes(booking.status)) {
      return res.status(400).json({
        message: "Booking cannot be cancelled"
      });
    }

    booking.status = "cancelled";
    await booking.save();

    global.io.emit("booking-updated", booking);

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- CAREGIVER ANALYTICS ----------------
exports.getCaregiverAnalytics = async (req, res) => {
  try {

    const caregiver = await Caregiver.findOne({ userId: req.user.id });

    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver profile not found" });
    }

    const caregiverObjectId = caregiver._id;

    // Status Distribution
    const statusStats = await Booking.aggregate([
      { $match: { caregiverId: caregiverObjectId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Monthly Trend
    const monthlyStats = await Booking.aggregate([
      { $match: { caregiverId: caregiverObjectId } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Total Completed Earnings
    const earnings = await Booking.aggregate([
      {
        $match: {
          caregiverId: caregiverObjectId,
          status: "completed"
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalCost" }
        }
      }
    ]);

    const totalEarnings = earnings.length > 0 ? earnings[0].total : 0;

    const totalBookings = await Booking.countDocuments({
      caregiverId: caregiverObjectId
    });

    res.status(200).json({
      statusStats,
      monthlyStats,
      totalEarnings,
      totalBookings
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- DECLINE BOOKING ----------------
exports.declineBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const caregiver = await Caregiver.findOne({ userId: req.user.id });

    if (!caregiver) {
      return res.status(403).json({ message: "Caregiver profile not found" });
    }

    if (booking.caregiverId.toString() !== caregiver._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status !== "requested") {
      return res.status(400).json({ message: "Cannot decline this booking" });
    }

    booking.status = "cancelled";
    await booking.save();

    global.io.emit("booking-updated", booking);

    res.status(200).json({
      message: "Booking declined successfully",
      booking
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};