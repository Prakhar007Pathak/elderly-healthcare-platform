const express = require('express');
const router = express.Router();

const {
  createService,
  getAllServices,
  getMyServices,
  deleteService,
  updateService
} = require('../controllers/service.controller');

const { protect, allowRoles } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// Create service (caregiver)
router.post(
  '/',
  protect,
  allowRoles('caregiver'),
  upload.single('image'),
  createService
);


// Marketplace services (all logged users)
router.get(
  '/',
  getAllServices
);


// Caregiver own services
router.get(
  '/my',
  protect,
  allowRoles('caregiver'),
  getMyServices
);


// Delete service
router.delete(
  '/:id',
  protect,
  allowRoles('caregiver'),
  deleteService
);

// update image
router.put(
  '/:id',
  protect,
  allowRoles('caregiver'),
  upload.single('image'),
  updateService
);

module.exports = router;