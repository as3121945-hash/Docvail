const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const User = require('../models/User');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0].msg });
  }

  const { name, email, phone, password, role } = req.body;
  
  if (!email && !phone) {
    return res.status(400).json({ msg: 'Please provide either an email or a phone number' });
  }

  let userQuery = [];
  if (email) userQuery.push({ email });
  if (phone) userQuery.push({ phone });
  
  let user = await User.findOne({ $or: userQuery });
  if (user) return res.status(400).json({ msg: 'User already exists with this email or phone' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60000); // 10 minutes

  user = new User({ name, email, phone, password, role, otp, otpExpires, isVerified: false });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  await user.save();

  // Send Email OTP
  if (email) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
        port: process.env.EMAIL_PORT || 587,
        auth: {
          user: process.env.EMAIL_USER || 'ethereal.user@ethereal.email',
          pass: process.env.EMAIL_PASS || 'ethereal_pass'
        }
      });

      await transporter.sendMail({
        from: '"Docvail" <no-reply@docvail.com>',
        to: user.email,
        subject: "Verify Your Docvail Account",
        text: `Your OTP is: ${otp}`,
        html: `<b>Your OTP is: <span style="font-size: 24px; color: #16a34a;">${otp}</span></b><br>It expires in 10 minutes.`,
      });
      console.log(`[EMAIL] OTP Sent to ${user.email}: ${otp}`);
    } catch (err) {
      console.error('Email failed to send OTP', err.message);
    }
  }

  // Send SMS OTP (Mock)
  if (phone) {
    // TODO: Integrate Fast2SMS or Twilio API here
    console.log(`[SMS MOCK] OTP Sent to ${user.phone}: ${otp}`);
  }

  const primaryContact = email || phone;
  res.json({ msg: 'Registration successful. Please verify your OTP.', requireOTP: true, identifier: primaryContact });
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0].msg });
  }

  const { identifier, password } = req.body;
  
  let user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
  if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

  if (!user.isVerified) {
    return res.status(401).json({ msg: 'Please verify your account via the OTP sent to you.', requireOTP: true, identifier: user.email || user.phone });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

  const payload = { user: { id: user.id, role: user.role } };
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5 days' }, (err, token) => {
    if (err) throw err;
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  });
};

exports.verifyOTP = async (req, res) => {
  const { identifier, otp } = req.body;
  if (!identifier || !otp) return res.status(400).json({ msg: 'Contact info and OTP are required' });

  const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
  if (!user) return res.status(400).json({ msg: 'User not found' });

  if (user.isVerified) return res.status(400).json({ msg: 'User already verified' });

  if (user.otp !== otp || user.otpExpires < Date.now()) {
    return res.status(400).json({ msg: 'Invalid or expired OTP' });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  const payload = { user: { id: user.id, role: user.role } };
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5 days' }, (err, token) => {
    if (err) throw err;
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  });
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};
