const Booking = require('../models/Booking');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

// Setup Nodemailer transport (Mocking config for now, will log to console if auth fails)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  port: process.env.EMAIL_PORT || 587,
  auth: {
    user: process.env.EMAIL_USER || 'ethereal.user@ethereal.email',
    pass: process.env.EMAIL_PASS || 'ethereal_pass'
  }
});

exports.createBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0].msg });
  }

  const { doctor_id, patient_name, patient_email, time, date } = req.body;

  const existingBooking = await Booking.findOne({ doctor_id, time, date, status: 'confirmed' });
  if (existingBooking) {
    return res.status(400).json({ msg: 'This slot is already booked. Please choose another time.' });
  }

  const newBooking = new Booking({
    doctor_id, patient_name, patient_email, time, date
  });

  const booking = await newBooking.save();

  try {
    await transporter.sendMail({
      from: '"Docvail" <no-reply@docvail.com>',
      to: patient_email,
      subject: "Appointment Confirmation",
      text: `Hello ${patient_name},\n\nYour appointment is confirmed for ${date} at ${time}.\n\nThank you for using Docvail.`,
      html: `<b>Hello ${patient_name},</b><br><br>Your appointment is confirmed for <b>${date}</b> at <b>${time}</b>.<br><br>Thank you for using Docvail.`,
    });
    console.log(`Email Sent: Confirmation for ${patient_name}`);
  } catch (err) {
    console.error('Email failed to send, but booking succeeded', err.message);
  }

  res.json(booking);
};

exports.getMyBookings = async (req, res) => {
  // Assuming patient's email is stored in req.user from token
  // Actually, req.user from auth middleware gives us req.user.id. 
  // Let's get the user email.
  const User = require('../models/User');
  const user = await User.findById(req.user.id);
  
  if (!user) return res.status(404).json({ msg: 'User not found' });

  // Patients book with patient_email. 
  // We fetch bookings matching their email.
  const bookings = await Booking.find({ patient_email: user.email }).populate('doctor_id', ['name', 'specialty']);
  res.json(bookings);
};

exports.getAllBookings = async (req, res) => {
  if (req.user.role === 'patient') return res.status(403).json({ msg: 'Not authorized' });

  const query = req.query.doctor_id ? { doctor_id: req.query.doctor_id } : {};
  const bookings = await Booking.find(query).populate('doctor_id', ['name', 'specialty']);
  res.json(bookings);
};

exports.getDoctorBookings = async (req, res) => {
  if (req.user.role !== 'doctor') return res.status(403).json({ msg: 'Not authorized' });

  // For this MVP, we find the Doctor profile that matches the user's name or email.
  // Ideally, User schema should have a reference to Doctor, or Doctor to User.
  // We'll use the user ID to find the linked doctor if we updated auth, 
  // but since we haven't linked them firmly in seed, we'll fetch bookings 
  // where the doctor's name matches the user's name.
  const User = require('../models/User');
  const Doctor = require('../models/Doctor');
  
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ msg: 'User not found' });

  const doctor = await Doctor.findOne({ name: user.name });
  if (!doctor) {
    // Return empty if no linked doctor profile found
    return res.json([]);
  }

  const bookings = await Booking.find({ doctor_id: doctor._id }).populate('doctor_id', ['name', 'specialty']);
  res.json(bookings);
};

exports.updateStatus = async (req, res) => {
  if (req.user.role === 'patient') return res.status(403).json({ msg: 'Not authorized' });

  const { status } = req.body;
  if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status' });
  }

  const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!booking) return res.status(404).json({ msg: 'Booking not found' });

  res.json(booking);
};
