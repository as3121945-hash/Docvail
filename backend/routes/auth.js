const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

// @route   POST api/auth/register
router.post('/register', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], authController.register);

// @route   POST api/auth/login
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  authController.login
);

// @route   POST api/auth/verify-otp
// @desc    Verify OTP to complete registration
// @access  Public
router.post('/verify-otp', authController.verifyOTP);

// @route   GET api/auth/me
router.get('/me', auth, authController.getMe);

module.exports = router;
