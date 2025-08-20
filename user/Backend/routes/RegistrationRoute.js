const express = require('express');
const Registration = require('../models/Registration');
const isLoggedIn = require('../middleware/authMiddleware');  
const router = express.Router();

router.use(express.json());
 


router.post('/createregistration', isLoggedIn, async (req, res) => {
    try {
        const {    modelofvehicle, vehicleclass, vehicletype } = req.body;

        if (
            
            !String(modelofvehicle).trim() ||
            !String(vehicleclass).trim() ||
            !String(vehicletype).trim()
        ) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const registerUser = await Registration.create({
           
            modelofvehicle,
            vehicleclass,
            vehicletype,
            user: req.user.userid   // Associate the record with the logged-in user
        });

        res.status(201).json({
            message: "Response recorded",
            register: registerUser
        });
    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({
            error: "An error occurred while processing your booking",
            details: error.message
        });
    }
});

 

 
router.get('/getregistration', isLoggedIn, async (req, res) => {
  try {
    const allRegistrations = await Registration.find({ user: req.user.userid })
      .sort({ createdAt: -1 }); // sort by most recent

    if (allRegistrations.length === 0) {
      return res.status(404).json({ error: "No vehicle registrations found for this user" });
    }

    res.status(200).json({
      success: true,
      registrationdata: allRegistrations
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Failed to fetch registration info",
      details: error.message
    });
  }
});





module.exports = router;
