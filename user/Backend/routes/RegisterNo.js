 

const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/authMiddleware');
const RegistrationNo = require('../models/RegistrationNo');

router.post('/registerno', isLoggedIn, async (req, res) => {
  try {
    const { registrationno } = req.body;
    
    if (!String(registrationno).trim()) {
      return res.status(400).json({ error: "All fields required" });
    }

    const registernodata = await RegistrationNo.create({
      registrationno,
      user: req.user.userid   
    });

    res.status(201).json({
      success: true,
      data: registernodata
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({
      error: "An error occurred while processing your booking",
      details: error.message
    });
  }
});

router.get('/getregisterno', isLoggedIn, async (req, res) => {
  try {
    const allregisterno = await RegistrationNo.find({ user: req.user.userid }).sort({ createdAt: -1 });

    if (allregisterno.length === 0) {
      return res.status(404).json({ error: "No registerno found" });
    }

    res.status(200).json({
      success: true,
      registernodata: allregisterno
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Failed to fetch registrationno info",
      details: error.message
    });
  }
});

module.exports = router;
