 


const express = require('express');
const router = express.Router();
const Bookings = require('../models/Bookings');
const User = require('../models/User')
const isLoggedIn = require('../middleware/authMiddleware')
// Add middleware to ensure JSON parsing
router.use(express.json());

router.post('/bookingconfirmed', isLoggedIn, async (req, res) => {
    // Validate that request body exists
    if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "Request body is empty" });
        }
        const {userid , email} = req.user;
        const { vehicle, quantity, dateofbook, time, location, nofnozel , fueltype  } = req.body;
        
        if (
            !String(vehicle).trim() ||
            !quantity ||
            !String(dateofbook).trim() ||
            !String(time).trim() ||
            !String(location).trim() ||
            !nofnozel ||
            !String(fueltype).trim() 
            // !String(stationname).trim()
        ) {
            return res.status(400).json({ error: "All fields are required" });
        }
        try {
            const user = await User.findById(userid).select('name');
          if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
     const bookingUser = await Bookings.create({
    // vehicle,
    quantity,
    dateofbook,
    time,
    // location,
    nofnozel,
    fueltype,
    // stationname,
    userid 
});

        // await Bookings.Save();
        res.status(201).json({ 
            message: "Booking confirmed", 
            booking: bookingUser 
        });
         
    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({ 
            error: "An error occurred while processing your booking",
            details: error.message
        });
    }
});
 
router.get('/getbookings', isLoggedIn, async (req, res) => {
    const { userid } = req.user;

    try {
        const bookinginfo = await Bookings.find({ userid: userid })
            .sort({ createdAt: -1 }); 

        res.status(200).json({ 
            success: true,
            bookingdata: bookinginfo 
        });
    } catch (error) {
        console.error("Fetch error:", error);
        res.status(500).json({ 
            error: true, 
            message: "Failed to fetch bookings",
            details: error.message
        });
    }
});



 

module.exports = router;