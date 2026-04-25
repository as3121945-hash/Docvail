const Hospital = require('../models/Hospital');
const { validationResult } = require('express-validator');

exports.getHospitals = async (req, res) => {
  const hospitals = await Hospital.find();
  res.json(hospitals);
};

exports.addHospital = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin authorization required' });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0].msg });
  }

  const newHospital = new Hospital(req.body);
  const hospital = await newHospital.save();
  res.json(hospital);
};
