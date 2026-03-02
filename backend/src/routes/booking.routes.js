const express = require('express');
const router = express.Router();

const { createBooking } = require('../controllers/booking.controller');
const { protect, allowRoles } = require('../middlewares/auth.middleware');
const { getMyBookings } = require('../controllers/booking.controller');
const { getPendingBookings } = require('../controllers/booking.controller');
const { acceptBooking } = require('../controllers/booking.controller');
const { updateBookingStatus } = require('../controllers/booking.controller');
const { getMyJobs } = require('../controllers/booking.controller');
const { cancelBooking } = require('../controllers/booking.controller');
const { getCaregiverAnalytics } = require('../controllers/booking.controller');
const { declineBooking } = require('../controllers/booking.controller');


// Create booking (family / elderly only)
router.post(
  '/',
  protect,
  allowRoles('family', 'elderly'),
  createBooking
);


router.get(
  '/my',
  protect,
  allowRoles('family', 'elderly'),
  getMyBookings
);


router.get(
  '/pending',
  protect,
  allowRoles('caregiver'),
  getPendingBookings
);


router.put(
  '/:id/accept',
  protect,
  allowRoles('caregiver'),
  acceptBooking
);


router.put(
  '/:id/status',
  protect,
  allowRoles('caregiver'),
  updateBookingStatus
);

// my jobs
router.get(
  '/my-jobs',
  protect,
  allowRoles('caregiver'),
  getMyJobs
);

// caregiver analytics
router.get(
  '/caregiver-analytics',
  protect,
  allowRoles('caregiver'),
  getCaregiverAnalytics
);

// cancel booking
router.put(
  '/:id/cancel',
  protect,
  allowRoles('family', 'elderly'),
  cancelBooking
);


router.put(
  '/:id/decline',
  protect,
  allowRoles('caregiver'),
  declineBooking
);



module.exports = router;
