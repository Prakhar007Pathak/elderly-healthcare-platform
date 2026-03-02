const express = require('express');
const router = express.Router();
const { protect, allowRoles } = require('../middlewares/auth.middleware');
const {
  getAllBookings,
  updateBookingByAdmin,
  forceCancelBooking,
  verifyCaregiver,
  rejectCaregiver,
  getAllCaregivers,
  getAnalytics,
  getStats,
  getAllUsers
} = require('../controllers/admin.controller');


// ================= BOOKINGS =================
router.get(
  '/bookings',
  protect,
  allowRoles('admin'),
  getAllBookings
);

router.put(
  '/bookings/:id/status',
  protect,
  allowRoles('admin'),
  updateBookingByAdmin
);

router.put(
  '/bookings/:id/force-cancel',
  protect,
  allowRoles('admin'),
  forceCancelBooking
);


// ================= CAREGIVERS =================
router.get(
  '/caregivers',
  protect,
  allowRoles('admin'),
  getAllCaregivers
);

router.put(
  '/caregivers/:id/verify',
  protect,
  allowRoles('admin'),
  verifyCaregiver
);

router.put(
  '/caregivers/:id/reject',
  protect,
  allowRoles('admin'),
  rejectCaregiver
);


// ================= STATS =================
router.get(
  '/stats',
  protect,
  allowRoles('admin'),
  getStats
);

router.get(
  '/analytics',
  protect,
  allowRoles('admin'),
  getAnalytics
);


// ================= USER =================


router.get(
  '/users',
  protect,
  allowRoles('admin'),
  getAllUsers
);


module.exports = router;