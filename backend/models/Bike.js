const mongoose = require('mongoose');

const BikeSchema = new mongoose.Schema({
  bikeId: {
    type: String,
    required: true,
    unique: true
  },
  model: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Mountain', 'Road', 'City', 'Ebike']
  },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Rented', 'Maintenance'],
    default: 'Available'
  },
  hourlyRate: {
    type: Number,
    required: true
  },
  dailyRate: {
    type: Number,
    required: true
  },
  notes: String,
  lastMaintenance: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Bike', BikeSchema);
