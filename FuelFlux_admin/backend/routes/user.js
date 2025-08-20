import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Registration from '../models/Registration.js';
import PetrolPump from '../models/PetrolPump.js';

const router = express.Router();

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const { firstName, lastName, address, city, state, pincode } = req.body;
        const user = await User.findById(req.user.id);
        
        user.profile = {
            ...user.profile,
            firstName: firstName || user.profile.firstName,
            lastName: lastName || user.profile.lastName,
            address: address || user.profile.address,
            city: city || user.profile.city,
            state: state || user.profile.state,
            pincode: pincode || user.profile.pincode
        };
        
        await user.save();
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user vehicles
router.get('/vehicles', verifyToken, async (req, res) => {
    try {
        const registrations = await Registration.find({ user: req.user.id });
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Add new vehicle
router.post('/vehicles', verifyToken, async (req, res) => {
    try {
        const { type, fuelType, registrationNumber, model } = req.body;
        const user = await User.findById(req.user.id);
        
        user.vehicles.push({
            type,
            fuelType,
            registrationNumber,
            model
        });
        
        await user.save();
        res.json({ message: 'Vehicle added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user bookings
router.get('/bookings', verifyToken, async (req, res) => {
    try {
        const bookings = await Booking.find({ userid: req.user.id })
            .sort({ dateofbook: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create new booking
router.post('/bookings', verifyToken, async (req, res) => {
    try {
        const { vehicle, quantity, dateofbook, time, location, nornozel, fueltype } = req.body;
        
        const booking = new Booking({
            vehicle,
            quantity,
            dateofbook,
            time,
            location,
            nornozel,
            fueltype,
            userid: req.user.id,
            amount: calculateAmount(quantity, fueltype) // You'll need to implement this function
        });
        
        await booking.save();
        
        // Update user's booking stats
        const user = await User.findById(req.user.id);
        user.lastBooking = new Date();
        user.totalBookings += 1;
        await user.save();
        
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get nearby stations
router.get('/stations', verifyToken, async (req, res) => {
    try {
        const { lat, lon, radius = 5000 } = req.query; // radius in meters
        
        const stations = await PetrolPump.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lon), parseFloat(lat)]
                    },
                    $maxDistance: radius
                }
            }
        });
        
        res.json(stations);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete own user profile/account
router.delete('/profile', verifyToken, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.json({ message: 'Your account has been deleted.' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
