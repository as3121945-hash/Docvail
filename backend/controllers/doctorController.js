const Doctor = require('../models/Doctor');

exports.getDoctors = async (req, res) => {
  const { city, specialty, hospital, page = 1, limit = 10 } = req.query;
  let query = {};
  if (city) query.city = { $regex: city, $options: 'i' };
  if (specialty) {
    // If user/AI sends "Cardiology", match "Cardiologist" by taking the root
    const rootSearch = specialty.replace(/ology$/i, '').replace(/ist$/i, '');
    query.specialty = { $regex: rootSearch, $options: 'i' };
  }
  if (hospital) query.hospital = hospital;

  const doctors = await Doctor.find(query)
    .populate('hospital', ['name', 'address'])
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const count = await Doctor.countDocuments(query);

  res.json({
    doctors,
    totalPages: Math.ceil(count / limit),
    currentPage: page
  });
};

exports.addDoctor = async (req, res) => {
  if (req.user.role === 'patient') return res.status(403).json({ msg: 'Not authorized' });

  const newDoctor = new Doctor(req.body);
  const doctor = await newDoctor.save();
  res.json(doctor);
};

exports.updateDoctor = async (req, res) => {
  if (req.user.role === 'patient') return res.status(403).json({ msg: 'Not authorized' });

  const doctor = await Doctor.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
  if (!doctor) return res.status(404).json({ msg: 'Doctor not found' });
  res.json(doctor);
};
