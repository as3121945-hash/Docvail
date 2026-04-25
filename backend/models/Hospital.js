const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  contact: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hospital', HospitalSchema);
