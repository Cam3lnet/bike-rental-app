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

// MongoDB Connection
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



