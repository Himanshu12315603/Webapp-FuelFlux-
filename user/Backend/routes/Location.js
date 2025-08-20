 
const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

router.post('/permission', async (req, res) => {
  const { latitude, longitude, city, country } = req.body;
  try {
    const newLocation = new Location({ latitude, longitude, city, country });
    await newLocation.save();
    res.status(201).json({ message: "Location Saved Successfully" });
  } catch (error) {
    console.error("Location save error:", error);
    res.status(501).json({ error: "Failed to save the location" });
  }
});

module.exports = router;
