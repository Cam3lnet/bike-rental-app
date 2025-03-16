const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Bike = require('../models/Bike');
const Customer = require('../models/Customer');

// Get all reservations
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('bikeId')
      .populate('customerId');
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new reservation
router.post('/', async (req, res) => {
  try {
    // Check bike availability
    const { bikeId, startDate, endDate } = req.body;
    
    const overlappingReservations = await Reservation.find({
      bikeId,
      $or: [
        { 
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) }
        }
      ],
      status: { $in: ['Pending', 'Active'] }
    });
    
    if (overlappingReservations.length > 0) {
      return res.status(400).json({ message: 'Bike is not available for selected dates' });
    }
    
    const reservation = new Reservation(req.body);
    const newReservation = await reservation.save();
    
    // Update bike status
    await Bike.findByIdAndUpdate(bikeId, { status: 'Rented' });
    
    res.status(201).json(newReservation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get calendar data (all bike availabilities)
router.get('/calendar', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Get all bikes
    const bikes = await Bike.find();
    
    // Get all reservations within date range
    const reservations = await Reservation.find({
      $or: [
        { startDate: { $lte: end, $gte: start } },
        { endDate: { $lte: end, $gte: start } },
        { 
          startDate: { $lte: start },
          endDate: { $gte: end }
        }
      ],
      status: { $in: ['Pending', 'Active'] }
    }).populate('customerId');
    
    // Create calendar data structure
    const calendarData = bikes.map(bike => {
      const bikeReservations = reservations.filter(
        res => res.bikeId.toString() === bike._id.toString()
      );
      
      return {
        bikeId: bike._id,
        bikeDetails: bike,
        reservations: bikeReservations.map(res => ({
          reservationId: res._id,
          customerName: res.customerId.name,
          startDate: res.startDate,
          endDate: res.endDate,
          status: res.status
        }))
      };
    });
    
    res.json(calendarData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
