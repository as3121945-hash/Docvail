const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  city: { type: String, required: true },
  availability: { type: Boolean, default: true },
  slots: [{ type: String }], // Array of strings like "10:00 AM - 11:00 AM"
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // optional link to a user account
}, {
  timestamps: true
});

module.exports = mongoose.model('Doctor', DoctorSchema);
