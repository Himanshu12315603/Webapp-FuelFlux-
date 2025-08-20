import express from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import Admin from '../models/Admin.js';
import PetrolPump from '../models/PetrolPump.js';
import Nozzle from '../models/Nozzle.js';
import Booking from '../models/Booking.js';

const router = express.Router();

// Get admin profile
router.get('/profile', verifyToken, isAdmin, async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin._id).select('-password');
        res.json(admin);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update admin profile
router.put('/profile', verifyToken, isAdmin, async (req, res) => {
    try {
        const { username, email, phoneNumber } = req.body;
        const admin = await Admin.findById(req.admin._id);
        
        if (username) admin.username = username;
        if (email) admin.email = email;
        if (phoneNumber) admin.phoneNumber = phoneNumber;
        
        await admin.save();
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Manage stations
router.get('/stations', verifyToken, isAdmin, async (req, res) => {
    try {
        const stations = await PetrolPump.find().populate('userid', 'username email');
        res.json(stations);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Manage bookings
router.get('/bookings', verifyToken, isAdmin, async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('userid', 'username email')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update booking status
router.put('/bookings/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Manage nozzles
router.get('/nozzles', verifyToken, isAdmin, async (req, res) => {
    try {
        const nozzles = await Nozzle.find().populate('stationId', 'name');
        res.json(nozzles);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
