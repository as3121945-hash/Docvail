const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patient_name: { type: String, required: true },
  patient_email: { type: String, required: true }, // Added email for the core feature: "Receive confirmation"
  time: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', BookingSchema);
