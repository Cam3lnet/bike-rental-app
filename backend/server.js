const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/bikes', require('./routes/bikeRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
