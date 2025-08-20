 const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const PetrolPump = require('../models/PetrolPump');
const User = require('../models/User');
const isLoggedIn = require('../middleware/authMiddleware');
// POST /api/pumps/save
router.post('/stationsave', authMiddleware, async (req, res) =>
 {
  const { lat, lon, name, operator , address } = req.body;
   const {userid , email} = req.user;

    if(!lat || !lon || !name || !operator || !address)
    {
       return res.status(400).json({ error: "All fields are required" });
    }

  try {
    
    const user = await User.findById(userid).select('name');
              if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
    const pump = await PetrolPump.create({
      
      lat,
      lon,
      name,
      operator,
      address,
      userid 
    });

   
    res.status(201).json({ message: 'Pump saved successfully', pump });
  } catch (err) {
  console.error('Error saving pump:', err.message, err.stack);
  res.status(500).json({ error: 'Failed to save pump', details: err.message });
}

});

router.get('/getpetrolpumps', isLoggedIn, async (req, res) => {
  try {
    const latestpumps = await PetrolPump.find({ userid: req.user.userid }).sort({ createdAt: -1 });

    if (!latestpumps) {
      return res.status(404).json({ error: "No pumps found" });
    }

    res.status(200).json({
      success: true,
      pumps: latestpumps
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
