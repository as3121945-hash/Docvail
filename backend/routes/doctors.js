const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const doctorController = require('../controllers/doctorController');
const { check } = require('express-validator');

// @route   GET api/doctors
// @desc    Get all doctors or search by city, specialty, hospital
router.get('/', doctorController.getDoctors);

// @route   POST api/doctors
// @desc    Add new doctor (Admin/Hospital only)
router.post('/', [
  auth,
  check('name', 'Name is required').not().isEmpty(),
  check('specialty', 'Specialty is required').not().isEmpty(),
  check('city', 'City is required').not().isEmpty()
], doctorController.addDoctor);

// @route   PUT api/doctors/:id
// @desc    Update doctor details/availability
router.put('/:id', auth, doctorController.updateDoctor);

module.exports = router;
