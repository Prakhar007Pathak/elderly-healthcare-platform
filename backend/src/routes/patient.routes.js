const express = require('express');
const router = express.Router();
const { createPatient, getMyPatients, updatePatient } = require('../controllers/patient.controller');
const { protect, allowRoles } = require('../middlewares/auth.middleware');

router.post(
  '/',
  protect,
  allowRoles('family', 'elderly'),
  createPatient
);

router.get(
  '/my',
  protect,
  allowRoles('family', 'elderly'),
  getMyPatients
);


router.put(
  '/:id',
  protect,
  allowRoles('family', 'elderly'),
  updatePatient
);


module.exports = router;
