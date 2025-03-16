const express = require('express');
const router = express.Router();
// We'll import the Customer model later when you create it
// const Customer = require('../models/Customer');

// Get all customers
router.get('/', async (req, res) => {
  try {
    // Placeholder until we create the Customer model
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add more routes later (POST, PUT, DELETE)

module.exports = router;
