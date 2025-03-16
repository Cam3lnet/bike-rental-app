const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  idNumber: {
    type: String,
    required: true
  },
  idScanUrl: String,
  address: String,
  rentalHistory: [{
    reservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation'
    },
    date: Date
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', CustomerSchema);
// Compare this snippet from backend/models/Reservation.js: