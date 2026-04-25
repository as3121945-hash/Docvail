const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bookingController = require('../controllers/bookingController');
const { check } = require('express-validator');

// @route   POST api/bookings
// @desc    Book an appointment (Patient)
router.post('/', [
  check('doctor_id', 'Doctor ID is required').not().isEmpty(),
  check('patient_name', 'Patient Name is required').not().isEmpty(),
  check('patient_email', 'Please include a valid email').isEmail(),
  check('time', 'Time is required').not().isEmpty(),
  check('date', 'Date is required').not().isEmpty()
], bookingController.createBooking);

// @route   GET api/bookings/my-bookings
// @desc    Get logged in patient's bookings
router.get('/my-bookings', auth, bookingController.getMyBookings);

// @route   GET api/bookings/doctor-bookings
// @desc    Get logged in doctor's bookings
router.get('/doctor-bookings', auth, bookingController.getDoctorBookings);

// @route   GET api/bookings
// @desc    Get bookings (Admin/Hospital/Doctor dashboard)
router.get('/', auth, bookingController.getAllBookings);

// @route   PUT api/bookings/:id/status
// @desc    Update booking status (Admin/Hospital/Doctor only)
router.put('/:id/status', auth, bookingController.updateStatus);

module.exports = router;
