const express = require('express');
const router = express.Router();
const Bike = require('../models/Bike');

// Get all bikes
router.get('/', async (req, res) => {
  try {
    const bikes = await Bike.find();
    res.json(bikes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new bike
router.post('/', async (req, res) => {
  const bike = new Bike(req.body);
  try {
    const newBike = await bike.save();
    res.status(201).json(newBike);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a bike
router.put('/:id', async (req, res) => {
  try {
    const updatedBike = await Bike.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true }
    );
    res.json(updatedBike);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a bike
router.delete('/:id', async (req, res) => {
  try {
    await Bike.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bike deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
