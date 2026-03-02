const express = require('express');
const router = express.Router();

const { protect, allowRoles } = require('../middlewares/auth.middleware');
const {
  getPublicCaregiver,
  createCaregiverProfile,
} = require('../controllers/caregiver.controller');

// Caregiver creates own profile
router.post(
  '/',
  protect,
  allowRoles('caregiver'),
  createCaregiverProfile
);

router.get(
  "/public/:id",
  protect,
  getPublicCaregiver
);


module.exports = router;
