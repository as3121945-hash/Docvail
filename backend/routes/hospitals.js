const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const hospitalController = require('../controllers/hospitalController');
const { check } = require('express-validator');

// @route   GET api/hospitals
router.get('/', hospitalController.getHospitals);

// @route   POST api/hospitals
// @desc    Add new hospital (Admin only)
router.post('/', [
  auth,
  check('name', 'Name is required').not().isEmpty(),
  check('address', 'Address is required').not().isEmpty(),
  check('city', 'City is required').not().isEmpty()
], hospitalController.addHospital);

module.exports = router;
