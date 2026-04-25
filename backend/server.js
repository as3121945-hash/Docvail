const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    // Attempt standard connection first
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/docvail');
    console.log('MongoDB connected successfully');
    
    // Seed database
    const seedDB = require('./utils/seedDB');
    await seedDB();

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.warn('Standard MongoDB connection failed. Falling back to in-memory server...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    console.log('In-memory MongoDB connected successfully');

    // Seed database
    const seedDB = require('./utils/seedDB');
    await seedDB();

    app.listen(PORT, () => console.log(`Server running on port ${PORT} (In-Memory DB)`));
  }
};

const PORT = process.env.PORT || 5000;

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/ai', require('./routes/ai'));

app.use(errorHandler);

connectDB();
