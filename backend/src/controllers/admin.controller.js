const Booking = require('../models/Booking');
const Caregiver = require('../models/Caregiver');
const User = require('../models/User');


// ================= GET ALL BOOKINGS =================
exports.getAllBookings = async (req, res) => {
  try {
    const { status, search } = req.query;

    let filter = {};

    if (status) {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .populate({
        path: 'patientId',
        select: 'name age emergencyContact'
      }).populate('serviceId', 'name pricePerHour')
      .populate({
        path: 'caregiverId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });

    let filteredBookings = bookings;

    // Search by patient or caregiver name
    if (search) {
      const lower = search.toLowerCase();

      filteredBookings = bookings.filter(b =>
        b.patientId?.name?.toLowerCase().includes(lower) ||
        b.caregiverId?.userId?.name?.toLowerCase().includes(lower)
      );
    }

    res.status(200).json({
      success: true,
      count: filteredBookings.length,
      data: filteredBookings
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ================= ADMIN UPDATE BOOKING STATUS =================
exports.updateBookingByAdmin = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    const allowedStatuses = [
      'requested',
      'accepted',
      'ongoing',
      'completed',
      'cancelled'
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    booking.status = status;
    await booking.save();

    global.io.emit("booking-updated", booking);

    res.status(200).json({
      success: true,
      message: "Booking status updated by admin",
      booking
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ================= FORCE CANCEL =================
exports.forceCancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    booking.status = "cancelled";
    await booking.save();

    global.io.emit("booking-updated", booking);

    res.status(200).json({
      success: true,
      message: "Booking force cancelled"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ================= GET ALL CAREGIVERS =================
exports.getAllCaregivers = async (req, res) => {
  try {
    const caregivers = await Caregiver.find()
      .populate({
        path: 'userId',
        select: 'name email phone'
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: caregivers.length,
      data: caregivers
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ================= VERIFY CAREGIVER =================
exports.verifyCaregiver = async (req, res) => {
  try {
    const caregiver = await Caregiver.findById(req.params.id);

    if (!caregiver) {
      return res.status(404).json({
        success: false,
        message: 'Caregiver not found'
      });
    }

    caregiver.verificationStatus = 'verified';
    await caregiver.save();

    res.status(200).json({
      success: true,
      message: 'Caregiver verified successfully'
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ================= REJECT CAREGIVER =================
exports.rejectCaregiver = async (req, res) => {
  try {
    const caregiver = await Caregiver.findById(req.params.id);

    if (!caregiver) {
      return res.status(404).json({
        success: false,
        message: 'Caregiver not found'
      });
    }

    caregiver.verificationStatus = 'rejected';
    await caregiver.save();

    res.status(200).json({
      success: true,
      message: 'Caregiver rejected successfully'
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ================= ADMIN STATS =================
exports.getStats = async (req, res) => {
  try {

    const totalUsers = await User.countDocuments();
    const totalCaregivers = await Caregiver.countDocuments();

    const verifiedCaregivers = await Caregiver.countDocuments({
      verificationStatus: 'verified'
    });

    const pendingCaregivers = await Caregiver.countDocuments({
      verificationStatus: 'pending'
    });

    const totalBookings = await Booking.countDocuments();

    const completedBookings = await Booking.countDocuments({
      status: 'completed'
    });

    const activeBookings = await Booking.countDocuments({
      status: { $in: ['accepted', 'ongoing'] }
    });

    const cancelledBookings = await Booking.countDocuments({
      status: 'cancelled'
    });

    // Calculate Total Revenue (Completed Only)
    const revenueAggregation = await Booking.aggregate([
      {
        $match: { status: 'completed' }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalCost" }
        }
      }
    ]);

    const totalRevenue =
      revenueAggregation.length > 0
        ? revenueAggregation[0].totalRevenue
        : 0;

    res.status(200).json({
      success: true,
      totalUsers,
      totalCaregivers,
      verifiedCaregivers,
      pendingCaregivers,
      totalBookings,
      completedBookings,
      activeBookings,
      cancelledBookings,
      totalRevenue
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= ADMIN ANALYTICS =================
exports.getAnalytics = async (req, res) => {
  try {

    // Bookings Per Month
    const bookingsPerMonth = await Booking.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Status Distribution
    const statusDistribution = await Booking.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Top Caregivers (completed jobs)
    const topCaregivers = await Booking.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$caregiverId",
          completedJobs: { $sum: 1 }
        }
      },
      { $sort: { completedJobs: -1 } },
      { $limit: 5 }
    ]);

    // Revenue Trend
    const revenueTrend = await Booking.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalCost" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.status(200).json({
      success: true,
      bookingsPerMonth,
      statusDistribution,
      topCaregivers,
      revenueTrend
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET ALL USERS (FAMILY + ELDERLY) =================
exports.getAllUsers = async (req, res) => {
  try {

    const users = await User.find({
      role: { $in: ['family', 'elderly'] }
    }).sort({ createdAt: -1 });

    const usersWithPatients = await Promise.all(
      users.map(async (user) => {
        const patients = await require('../models/Patient').find({
          userId: user._id
        });

        return {
          ...user.toObject(),
          patients
        };
      })
    );

    res.status(200).json({
      success: true,
      count: usersWithPatients.length,
      data: usersWithPatients
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};