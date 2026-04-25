const mongoose = require('mongoose');

const seedDoctors = [
  {
    name: "Dr. Rajesh Sharma",
    specialty: "Cardiologist",
    city: "Delhi",
    availability: true,
    slots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM"],
    experience: "15+ years"
  },
  {
    name: "Dr. Ananya Iyer",
    specialty: "Gastroenterologist",
    city: "Jaipur",
    availability: true,
    slots: ["10:30 AM", "11:30 AM", "01:00 PM", "04:30 PM"],
    experience: "8 years"
  },
  {
    name: "Dr. Vikram Singh",
    specialty: "Neurologist",
    city: "Mumbai",
    availability: true,
    slots: ["09:00 AM", "12:00 PM", "03:00 PM"],
    experience: "12 years"
  },
  {
    name: "Dr. Priya Varma",
    specialty: "Pediatrician",
    city: "Jaipur",
    availability: true,
    slots: ["10:00 AM", "11:00 AM", "05:00 PM"],
    experience: "6 years"
  },
  {
    name: "Dr. Amit Patel",
    specialty: "Orthopedic",
    city: "Ahmedabad",
    availability: false,
    slots: [],
    experience: "20 years"
  },
  {
    name: "Dr. Sunita Reddy",
    specialty: "Gastroenterologist",
    city: "Delhi",
    availability: true,
    slots: ["08:00 AM", "09:30 AM", "02:00 PM"],
    experience: "10 years"
  }
];

const seedDB = async () => {
  try {
    const Doctor = mongoose.model('Doctor') || mongoose.model('Doctor', new mongoose.Schema({
      name: String,
      specialty: String,
      city: String,
      availability: Boolean,
      slots: [String],
      experience: String
    }));

    const count = await Doctor.countDocuments();
    if (count === 0) {
      await Doctor.insertMany(seedDoctors);
      console.log('Database seeded with dummy doctors');
    }
  } catch (err) {
    console.error('Error seeding database:', err);
  }
};

module.exports = seedDB;
