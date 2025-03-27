const express = require('express');
const router = express.Router();
const Bike = require('../models/Bike');
const verifyToken = require('../middleware/auth');
const BikeController = require('../controllers/bikeController');

// Get all bikes
router.get('/bikes', async (req, res) => {
  try {
    const bikes = await Bike.find();
    res.json(bikes);
  } catch (error) {
    console.error('Error fetching bikes:', error);
    res.status(500).json({ message: 'Failed to fetch bikes' });
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




// Protected route example
router.post('/bikes', verifyToken, validateBike, BikeController.createBike);

// Other protected routes...
router.put('/bikes/:id', verifyToken, BikeController.updateBike);
router.delete('/bikes/:id', verifyToken, BikeController.deleteBike);

module.exports = router;


