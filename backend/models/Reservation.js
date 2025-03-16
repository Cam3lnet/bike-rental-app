const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  bikeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bike',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Active', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  totalCost: {
    type: Number,
    required: true
  },
  contractUrl: String,
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Reservation', ReservationSchema);
