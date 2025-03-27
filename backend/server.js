const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware for validation
const validateBike = (req, res, next) => {
  const { error } = bikeSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

router.post('/bikes', validateBike, async (req, res) => {
  // Route handler code
});

// MongoDB Connection
console.log('MongoDB URI:', process.env.MONGODB_URI); //log test

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Bike Rental API' });
});

// Routes
app.use('/api/bikes', require('./routes/bikeRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Add Joi validation for bike creation/updates
const Joi = require('joi');

const bikeSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  price: Joi.number().positive().required(),
  available: Joi.boolean().default(true),
  location: Joi.string()
});



