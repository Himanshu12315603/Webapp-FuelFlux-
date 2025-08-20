// import express from 'express';
// import mongoose from 'mongoose';
// import userRoutes from './user.js';
// import adminRoutes from './admin.js';
// import authRoutes from './auth.js';
// import { verifyToken, isAdmin } from '../middleware/auth.js';
// import Booking from '../models/Booking.js';
// import User from '../models/User.js';
// import Location from '../models/Location.js';
// import PetrolPump from '../models/PetrolPump.js';
// import Registration from '../models/Registration.js';
// import Notification from '../models/Notification.js';
// import Feedback from '../models/Feedback.js';
// import Nozzle from '../models/Nozzle.js';
// import cron from 'node-cron';
// const router = express.Router();

// // Get all stations for the logged-in user




// // router.get('/api/stations', verifyToken, async (req, res) => {
// // try {
// //     const userId = req.user.id || req.user._id;

// //     if (!mongoose.Types.ObjectId.isValid(userId)) {
// //       return res.status(400).json({ error: 'Invalid user ID format' });
// //     }

// //     const stations = await PetrolPump.find({ 
// //       userid: mongoose.Types.ObjectId(userId) 
// //     }).lean();

// //     // 🔧 Attach nozzle data (fuel types and prices)
// //     const stationsWithNozzles = await Promise.all(
// //       stations.map(async (station) => {
// //         const nozzle = await Nozzle.findOne({ stationId: station._id }).lean();
// //         return {
// //           ...station,
// //           nozzles: nozzle || {
// //             petrol: [],
// //             diesel: [],
// //             cng: [],
// //             electric: [],
// //             other: [],
// //           },
// //         };
// //       })
// //     );

// //     res.json(stationsWithNozzles);
// //   } catch (err) {
// //     console.error('Error fetching stations:', err);
// //     res.status(500).json({ error: 'Failed to fetch stations', details: err.message });
// //   }
// // });

// // Create or update nozzle configuration for a station


// router.post('/api/nozzles', async (req, res) => {
//   try {
//     const { stationId, petrol, diesel, cng, electric, other } = req.body;
//     if (!stationId) {
//       return res.status(400).json({ error: 'stationId is required.' });
//     }
//     // Upsert logic: update if exists, create if not
//     const update = {
//       stationId,
//       petrol: petrol || [],
//       diesel: diesel || [],
//       cng: cng || [],
//       electric: electric || [],
//       other: other || []
//     };
//     const nozzleDoc = await Nozzle.findOneAndUpdate(
//       { stationId: String(stationId) },
//       update,
//       { new: true, upsert: true, setDefaultsOnInsert: true }
//     );
//     res.status(200).json(nozzleDoc);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get nozzle configuration for a station
// router.get('/api/nozzles/:stationId', async (req, res) => {
//   try {
//     const { stationId } = req.params;
//     if (!stationId) return res.status(400).json({ error: 'stationId is required' });
//     const nozzleDoc = await Nozzle.findOne({ stationId: String(stationId) });
//     if (!nozzleDoc) return res.status(404).json({ error: 'No nozzle config found for this station' });
//     res.json(nozzleDoc);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Update nozzle configuration for a station
// router.put('/api/nozzles/:stationId', async (req, res) => {
//   try {
//     const { stationId } = req.params;
//     const { petrol, diesel, cng, electric, other } = req.body;
//     if (!stationId) {
//       return res.status(400).json({ error: 'stationId is required.' });
//     }
//     // Only update if exists
//     const existing = await Nozzle.findOne({ stationId: String(stationId) });
//     if (!existing) return res.status(404).json({ error: 'No nozzle config found for this station' });
//     existing.petrol = petrol || [];
//     existing.diesel = diesel || [];
//     existing.cng = cng || [];
//     existing.electric = electric || [];
//     existing.other = other || [];
//     await existing.save();
//     res.status(200).json(existing);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Delete nozzle configuration for a station
// router.delete('/api/nozzles/:stationId', async (req, res) => {
//   try {
//     const { stationId } = req.params;
//     if (!stationId) return res.status(400).json({ error: 'stationId is required' });
//     const result = await Nozzle.findOneAndDelete({ stationId: String(stationId) });
//     if (!result) return res.status(404).json({ error: 'No nozzle config found to delete for this station' });
//     res.json({ message: 'Nozzle configuration deleted successfully.' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// import Employee from '../models/Employee.js';
// import Session from '../models/Session.js'; // Import Session model

// // Mount routes (order matters)
// router.use('/auth', authRoutes);  // Authentication routes (login, register, etc.)
// router.use('/user', verifyToken, userRoutes);  // Protected user routes
// router.use('/admin', verifyToken, isAdmin, adminRoutes);  // Protected admin routes

// // Dashboard: Get overview stats and recent data
// router.get('/dashboard', verifyToken, async (req, res) => {
//   try {
//     const todayStart = new Date('2025-06-01T00:00:00.000Z');
//     const todayEnd = new Date('2025-06-01T23:59:59.999Z');
//     const userId = req.user.id || req.user._id;

//     // Only count stations belonging to the logged-in user
//     const totalStations = await PetrolPump.countDocuments({ userid: userId });
    
//     // For admin users, you might want to show all users, but for regular users, show only their own data
//     const userFilter = req.user.role === 'admin' ? {} : { _id: userId };
//     const totalUsers = await User.countDocuments(userFilter);
    
//     // Only count today's bookings for this user's stations
//     const userStations = await PetrolPump.find({ userid: userId }).select('_id');
//     const stationIds = userStations.map(station => station._id);
    
//     const todaysBookings = await Booking.countDocuments({
//       station: { $in: stationIds },
//       dateofbook: { $gte: todayStart, $lte: todayEnd }
//     });
    
//     const activeAlerts = 0; // Placeholder; derive from bookings/petrolpumps if needed

//     // Only fetch bookings for the logged-in user
//     const recentBookings = await Booking.find({ userid: req.user.id })
//       .populate('userid', 'username')
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .select('vehicle quantity dateofbook time location fueltype');

//     const latestNotification = recentBookings.length > 0
//       ? `Low fuel booking by ${recentBookings[0].userid?.username || 'Unknown'} at ${recentBookings[0].location}`
//       : 'No recent notifications';

//     res.json({
//       totalStations,
//       totalUsers,
//       todaysBookings,
//       activeAlerts,
//       recentBookings,
//       latestNotification
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Employees: Get stats and list
// router.get('/employees/stats', async (req, res) => {
//   try {
//     const total = await User.countDocuments();
//     const active = await User.countDocuments({ status: 'active' });
//     const inactive = await User.countDocuments({ status: 'inactive' });
//     res.json({ total, active, inactive });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// router.get('/employees', verifyToken, async (req, res) => {
//   try {
//     // Find all stations owned by the logged-in user
//     const userStations = await PetrolPump.find({ userid: req.user.id }).select('_id');
//     const stationIds = userStations.map(station => station._id);
//     // Filter employees whose station is in user's stations
//     const filter = { station: { $in: stationIds } };
//     if (req.query.stationId) {
//       filter.station = req.query.stationId;
//     }
//     const employees = await Employee.find(filter).select('_id name mobile role shift station');
//     res.json(employees);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// router.post('/employees', verifyToken, async (req, res) => {
//   try {
//     const { name, role, mobile, shift, station } = req.body;
//     console.log('Incoming employee POST data:', req.body);

//     // Validate inputs
//     if (!name || !role || !mobile || !shift || !station) {
//       console.error('Validation failed: missing fields');
//       return res.status(400).json({ error: 'All fields (including station) are required.' });
//     }
//     if (!/^[0-9]{10}$/.test(mobile)) {
//       console.error('Validation failed: invalid mobile');
//       return res.status(400).json({ error: 'Mobile number must be exactly 10 digits.' });
//     }

//     // Check if the station exists
//     const stationExists = await PetrolPump.findById(station);
//     if (!stationExists) {
//       console.error('Referenced station does not exist:', station);
//       return res.status(400).json({ error: 'Selected station does not exist. Please select a valid station.' });
//     }

//     // Create new employee
//     const newEmployee = new Employee({
//       name,
//       role,
//       mobile,
//       shift,
//       station
//     });

//     await newEmployee.save();
//     res.status(201).json({ message: 'Employee added successfully', employee: newEmployee });
//   } catch (err) {
//     console.error('Error saving employee:', err);
//     res.status(500).json({ error: err.message, stack: err.stack });
//   }
// });

// router.delete('/employees/:id', verifyToken, async (req, res) => {
//   try {
//     // Only allow admin to delete employees
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'You are not authorized to delete this employee.' });
//     }
//     const employee = await User.findById(req.params.id);
//     if (!employee) {
//       return res.status(404).json({ error: 'Employee not found.' });
//     }
//     await User.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Employee deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Bookings: Get stats and list
// router.get('/bookings/stats', async (req, res) => {
//   try {
//     const total = await Booking.countDocuments();
//     const completed = await Booking.countDocuments({ status: 'completed' });
//     const pending = await Booking.countDocuments({ status: 'pending' });
//     const cancelled = await Booking.countDocuments({ status: 'cancelled' });
//     res.json({ total, completed, pending, cancelled });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// router.get('/bookings', async (req, res) => {
//   try {
//     const { tab, search, stationId } = req.query;
//     const todayStart = new Date();
//     todayStart.setHours(0, 0, 0, 0);
//     const todayEnd = new Date();
//     todayEnd.setHours(23, 59, 59, 999);

//     let query = {};
//     if (tab === 'today') {
//       query.dateofbook = { $gte: todayStart, $lte: todayEnd };
//     } else if (tab === 'cancelled') {
//       query.status = 'cancelled';
//     } else {
//       query.dateofbook = { $lt: todayEnd }; // Alltimebooking
//     }

//     if (stationId) {
//       query.station = stationId;
//     }

//     if (search) {
//       const users = await User.find({ username: new RegExp(search, 'i') }).select('_id');
//       const userIds = users.map(user => user._id);
//       query.userid = { $in: userIds };
//     }

    
//     // Ensure bookings are filtered by logged-in user
//     if (!query.userid) query.userid = req.user.id;
//     const bookings = await Booking.find(query)
//       .populate('userid', 'username')
//       .populate('station', 'name')
//       .select('_id userid location fueltype dateofbook time amount status station');
//     res.json(bookings);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Booking stats for a station
// router.get('/bookings/stats', async (req, res) => {
//   try {
//     const { stationId } = req.query;
//     if (!stationId) return res.status(400).json({ error: 'stationId is required' });
//     const total = await Booking.countDocuments({ station: stationId });
//     const completed = await Booking.countDocuments({ station: stationId, status: 'completed' });
//     const pending = await Booking.countDocuments({ station: stationId, status: 'pending' });
//     const cancelled = await Booking.countDocuments({ station: stationId, status: 'cancelled' });
//     res.json({ total, completed, pending, cancelled });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Notifications: Use Notification collection
// router.get('/notifications/stats', async (req, res) => {
//   try {
//     const total = await Notification.countDocuments();
//     const unread = await Notification.countDocuments({ status: 'Unread' });
//     const read = await Notification.countDocuments({ status: 'Read' });
//     res.json({ total, unread, read });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Fetch notifications for the logged-in user, filtered by user's stations
// router.get('/notifications', verifyToken, async (req, res) => {
//   try {
//     console.log('=== FETCH NOTIFICATIONS REQUEST ===');
//     console.log('User ID:', req.user.id);
//     console.log('Query params:', req.query);
    
//     // First, get all stations owned by the user
//     let userStations;
//     try {
//       userStations = await PetrolPump.find({ userid: req.user.id }).lean();
//       console.log('User stations from DB:', JSON.stringify(userStations, null, 2));
//     } catch (dbErr) {
//       console.error('Error fetching user stations:', dbErr);
//       return res.status(500).json({ 
//         error: 'Database error fetching stations',
//         details: dbErr.message 
//       });
//     }
    
//     if (!userStations || userStations.length === 0) {
//       console.log('No stations found for user');
//       return res.json([]);
//     }
    
//     // Get station IDs the user has access to
//     const stationIds = userStations.map(station => station._id.toString());
//     console.log('Station IDs user has access to:', stationIds);
    
//     // If a specific station is requested, verify the user has access to it
//     const { stationId } = req.query;
//     console.log('Requested stationId:', stationId);
    
//     if (stationId) {
//       try {
//         // Convert stationId to string for comparison
//         const stationIdStr = stationId.toString();
        
//         if (!stationIds.includes(stationIdStr)) {
//           console.log('Access denied - user does not have access to station:', stationIdStr);
//           return res.status(403).json({ 
//             error: 'Access to the specified station is denied',
//             userStations: stationIds,
//             requestedStation: stationIdStr
//           });
//         }
        
//         // Fetch only notifications for the specified station
//         console.log('Fetching notifications for station:', stationIdStr);
//         const query = { stationId: stationIdStr };
//         console.log('MongoDB query:', JSON.stringify(query));
        
//         const notifications = await Notification.find(query).sort({ date: -1 }).lean();
//         console.log(`Found ${notifications.length} notifications for station ${stationIdStr}`);
        
//         return res.json(notifications);
        
//       } catch (queryErr) {
//         console.error('Error querying notifications:', queryErr);
//         return res.status(500).json({
//           error: 'Error querying notifications',
//           details: queryErr.message,
//           stack: process.env.NODE_ENV === 'development' ? queryErr.stack : undefined
//         });
//       }
//     }
    
//     // If no specific station is requested, get notifications for all user's stations
//     try {
//       console.log('Fetching notifications for all user stations:', stationIds);
//       const query = { stationId: { $in: stationIds } };
//       console.log('MongoDB query:', JSON.stringify(query));
      
//       const notifications = await Notification.find(query).sort({ date: -1 }).lean();
//       console.log(`Found ${notifications.length} total notifications`);
      
//       return res.json(notifications);
      
//     } catch (bulkQueryErr) {
//       console.error('Error in bulk notifications query:', bulkQueryErr);
//       return res.status(500).json({
//         error: 'Error fetching notifications',
//         details: bulkQueryErr.message,
//         stationIds: stationIds,
//         query: { stationId: { $in: stationIds } }
//       });
//     }
    
//   } catch (err) {
//     console.error('Unhandled error in /notifications endpoint:', {
//       error: err,
//       message: err.message,
//       stack: err.stack,
//       user: req.user ? { id: req.user.id } : 'No user in request'
//     });
    
//     return res.status(500).json({
//       error: 'Internal server error',
//       message: err.message,
//       ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
//     });
//   }
// });

// // Create notification
// router.post('/notifications', verifyToken, async (req, res) => {
//   try {
//     const userId = req.user.id; // Extract user ID from the token
//     const { title, message, status, stationId } = req.body;
//     if (!stationId) {
//       return res.status(400).json({ error: 'stationId is required' });
//     }

//     // Generate notificationCode (optional display code)
//     let notificationCode = 'NOT-001';
//     const lastNotification = await Notification.findOne().sort({ date: -1 });
//     if (lastNotification && lastNotification.notificationCode) {
//       const lastNum = parseInt(lastNotification.notificationCode.replace(/\D/g, ''));
//       if (!isNaN(lastNum)) {
//         notificationCode = `NOT-${String(lastNum + 1).padStart(3, '0')}`;
//       }
//     }

//     // Lookup station name
//     let stationName = 'Unknown Station';
//     if (!mongoose.Types.ObjectId.isValid(stationId)) {
//       console.error('Invalid stationId:', stationId);
//       return res.status(400).json({ error: 'Invalid stationId format' });
//     }
//     const stationDoc = await PetrolPump.findById(stationId);
//     if (!stationDoc) {
//       console.error('Station not found for ID:', stationId);
//       return res.status(404).json({ error: 'Station not found for the given stationId' });
//     }
//     stationName = stationDoc.name || stationDoc.stationName || 'Unknown Station';

//     const newNotification = new Notification({
//       notificationCode,
//       userId, // Save with user ID for isolation
//       title,
//       message,
//       stationId,
//       stationName,
//       status,
//       date: new Date()
//     });

//     await newNotification.save();
//     res.status(201).json({ message: 'Notification added successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// router.delete('/notifications/:id', async (req, res) => {
//   try {
//     await Notification.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Notification deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Feedback: Use Feedback collection
// router.get('/feedback/stats', async (req, res) => {
//   try {
//     const total = await Feedback.countDocuments();
//     const positive = await Feedback.countDocuments({ rating: 'Positive' });
//     const negative = await Feedback.countDocuments({ rating: 'Negative' });
//     res.json({ total, positive, negative });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// router.get('/feedback', async (req, res) => {
//   try {
//     // Only fetch feedback for the logged-in user
//     const feedback = await Feedback.find({ userid: req.user.id });
//     res.json(feedback);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// router.post('/feedback', async (req, res) => {
//   try {
//     const { customer, rating, comment } = req.body;
//     const lastFeedback = await Feedback.findOne().sort({ _id: -1 });
//     const lastId = lastFeedback ? parseInt(lastFeedback._id.toString().slice(-3)) : 0;
//     const newId = `FB-${String(lastId + 1).padStart(3, '0')}`;
//     const newFeedback = new Feedback({
//       _id: newId,
//       customer,
//       rating,
//       comment,
//       date: new Date()
//     });
//     await newFeedback.save();
//     res.status(201).json({ message: 'Feedback added successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// router.delete('/feedback/:id', async (req, res) => {
//   try {
//     await Feedback.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Feedback deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Nozzles: Use Nozzle collection
// router.get('/nozzles', async (req, res) => {
//   try {
//     const nozzleConfigs = await Nozzle.find({
//       $or: [
//         { 'nozzles.petrol': { $gt: 1 } },
//         { 'nozzles.diesel': { $gt: 1 } },
//         { 'nozzles.cng': { $gt: 1 } },
//         { 'nozzles.electric': { $gt: 1 } },
//         { 'nozzles.other': { $gt: 1 } }
//       ]
//     });

//     res.json(nozzleConfigs);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// router.post('/nozzles', verifyToken, async (req, res) => {
//   try {
//     const userId = req.user.id; // Extract user ID from the token
//     const { stationId, nozzles = {}, prices = {} } = req.body;

//     // Validate inputs
//     if (!stationId) {
//       return res.status(400).json({ error: 'Station ID is required.' });
//     }

//     // Ensure nozzles and prices are objects with default values
//     const defaultNozzles = { petrol: 0, diesel: 0, cng: 0, electric: 0, other: 0 };
//     const defaultPrices = { petrol: 0, diesel: 0, cng: 0, electric: 0, other: 0 };

//     const sanitizedNozzles = { ...defaultNozzles, ...nozzles };
//     const sanitizedPrices = { ...defaultPrices, ...prices };

//     // Save configuration to the database
//     const newNozzleConfig = new Nozzle({
//       userId,
//       stationId,
//       nozzles: sanitizedNozzles,
//       prices: sanitizedPrices
//     });
//     await newNozzleConfig.save();

//     res.status(201).json({ message: 'Nozzle configuration saved successfully!' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// router.delete('/nozzles', async (req, res) => {
//   try {
//     await Nozzle.deleteMany({});
//     res.json({ message: 'Nozzle configuration deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Stations: Get list and manage
// // Get a single station by ID
// router.get('/stations/:id', async (req, res) => {
//   try {
//     const station = await PetrolPump.findById(req.params.id);
//     if (!station) return res.status(404).json({ error: 'Station not found.' });
//     res.json(station);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Update a station's status
// router.patch('/stations/:id/status', verifyToken, async (req, res) => {
//   try {
//     const { status } = req.body;
//     const validStatuses = ['active', 'inactive', 'maintenance'];
    
//     if (!status || !validStatuses.includes(status)) {
//       return res.status(400).json({ error: 'Invalid status. Must be one of: active, inactive, maintenance' });
//     }

//     const updatedStation = await PetrolPump.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true, runValidators: true }
//     );

//     if (!updatedStation) {
//       return res.status(404).json({ error: 'Station not found' });
//     }

//     res.json(updatedStation);
//   } catch (err) {
//     console.error('Error updating station status:', err);
//     res.status(500).json({ error: 'Failed to update station status', details: err.message });
//   }
// });

// // Update a single station by ID
// router.put('/stations/:id', verifyToken, async (req, res) => {
//   try {
//     const station = await PetrolPump.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!station) return res.status(404).json({ error: 'Station not found.' });
//     res.json(station);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// router.get('/stations', verifyToken, async (req, res) => {
//   try {
//     const { search } = req.query;
//     let query = {};

//     // Only admin can see all stations; users see only their own
//     if (req.user.role !== 'admin') {
//       query.userid = req.user.id;
//     }

//     if (search) {
//       query.$or = [
//         { name: new RegExp(search, 'i') },
//         {
//           $and: [
//             { lat: { $exists: true } },
//             { lon: { $exists: true } }
//           ],
//           location: new RegExp(search, 'i')
//         }
//       ];
//     }

//     const petrolPumps = await PetrolPump.find(query)
//       .populate('userid', 'username')
//       .select('_id name lat lon contact status fuelTypes'); // ✅ include fuelTypes

//     res.json(petrolPumps.map((pump) => ({
//       _id: pump._id,
//       name: pump.name,
//       location: `${pump.lat}, ${pump.lon}`,
//       contact: pump.contact || 'N/A',
//       status: pump.status || 'Active',
//       fuelTypes: pump.fuelTypes || []               // ✅ include fuelTypes in response
//     })));
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// router.post('/stations', verifyToken, async (req, res) => {
//   try {
//     const userid = req.user.id; // Extract user ID from the token
//     const { name, location, contact, upiId, status = 'active', fuelTypes = [] } = req.body;
    
//     if (!location || !upiId) {
//       return res.status(400).json({ error: 'Location and UPI ID are required' });
//     }
    
//     const [lat, lon] = location.split(',').map(coord => parseFloat(coord.trim()));

//     const newPetrolPump = new PetrolPump({
//       userid,
//       lat,
//       lon,
//       name,
//       operator: 'UnknownOperator',
//       contact,
//       upiId,
//       status,
//       fuelTypes: Array.isArray(fuelTypes) ? fuelTypes : [] // Ensure fuelTypes is an array
//     });

//     await newPetrolPump.save();
//     res.status(201).json({ message: 'Station added successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
 


// router.delete('/stations/:id', verifyToken, async (req, res) => {
//   try {
//     const station = await PetrolPump.findById(req.params.id);
//     if (!station) {
//       return res.status(404).json({ error: 'Station not found.' });
//     }
//     // Allow only owner or admin
//     if (station.userId?.toString() !== req.user.id && req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'You are not authorized to delete this station.' });
//     }
//     await PetrolPump.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Station deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Updated route to handle string stationId
// router.post('/stations/:stationId/nozzles', verifyToken, async (req, res) => {
//     try {
//         const { stationId } = req.params;
//         const { nozzles, prices } = req.body;

//         console.log('Request received:', { stationId, nozzles, prices });
//         console.log('Token from request:', req.header('Authorization'));

//         // Validate stationId
//         const objectIdStationId = mongoose.Types.ObjectId.isValid(stationId) ? new mongoose.Types.ObjectId(stationId) : null;
//         if (!objectIdStationId) {
//             console.error('Invalid station ID format:', stationId);
//             return res.status(400).json({ error: 'Invalid station ID format.' });
//         }

//         // Fetch the PetrolPump document
//         const station = await PetrolPump.findById(stationId);
//         if (!station) {
//             console.error('Station not found:', stationId);
//             return res.status(404).json({ error: 'Station not found.' });
//         }

//         // Update nozzles and prices
//         station.nozzles = nozzles;
//         station.prices = prices;

//         // Save the updated document
//         await station.save();

//         console.log('Nozzle configuration saved successfully:', { stationId, nozzles, prices });
//         res.status(200).json({ message: 'Nozzle configuration saved successfully.' });
//     } catch (err) {
//         console.error('Error saving nozzle configuration:', err);
//         res.status(500).json({ error: err.message });
//     }
// });

// // Route to fetch nozzle configuration for a specific station
// router.get('/stations/:stationId/nozzles', verifyToken, async (req, res) => {
//     try {
//         const { stationId } = req.params;

//         // Find the station
//         const station = await PetrolPump.findById(stationId);
//         if (!station) {
//             return res.status(404).json({ error: 'Station not found.' });
//         }

//         res.status(200).json({ nozzles: station.nozzles, prices: station.prices });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Route to update nozzle configuration for a specific station
// router.put('/stations/:stationId/nozzles', verifyToken, async (req, res) => {
//     try {
//         const { stationId } = req.params;
//         const { nozzles, prices } = req.body;

//         // Validate inputs
//         if (!nozzles || !prices) {
//             return res.status(400).json({ error: 'Nozzles and prices are required.' });
//         }

//         // Find the station
//         const station = await PetrolPump.findById(stationId);
//         if (!station) {
//             return res.status(404).json({ error: 'Station not found.' });
//         }

//         // Update nozzle configuration
//         station.nozzles = nozzles;
//         station.prices = prices;
//         await station.save();

//         res.status(200).json({ message: 'Nozzle configuration updated successfully.' });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });





// // Add employee
// router.post('/api/employees', async (req, res) => {
//   try {
//     const { name, mobile, role, shift, station } = req.body;
//     if (!name || !mobile || !role || !shift || !station) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }
//     if (!/^[0-9]{10}$/.test(mobile)) {
//       return res.status(400).json({ error: 'Mobile must be 10 digits' });
//     }
//     const employee = new Employee({ name, mobile, role, shift, station });
//     await employee.save();
//     res.status(201).json(employee);
//   } catch (err) {
//     console.error('Add employee error:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Only show employees for current user
// router.get('/api/employees', verifyToken, async (req, res) => {

// // Delete employee (only if station belongs to user)
// router.delete('/api/employees/:id', verifyToken, async (req, res) => {
//   try {
//     const emp = await Employee.findById(req.params.id);
//     if (!emp) return res.status(404).json({ error: 'Employee not found' });
//     // Find all stations owned by this user
//     const pumps = await PetrolPump.find({ userid: req.user.id || req.user._id });
//     const pumpIds = pumps.map(p => p._id.toString());
//     if (!pumpIds.includes(emp.station.toString())) {
//       return res.status(403).json({ error: 'Not authorized to delete this employee' });
//     }
//     await emp.deleteOne();
//     res.json({ message: 'Employee deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

//   try {
//     // Find all stations owned by this user
//     const pumps = await PetrolPump.find({ userid: req.user.id || req.user._id });
//     const pumpIds = pumps.map(p => p._id);
//     // Find employees whose station is in user's pumps
//     const employees = await Employee.find({ station: { $in: pumpIds } }).populate('station');
//     res.json(employees);
//   } catch (err) {
//     console.error('[Notification Cleanup] Error deleting old notifications:', err);
//   }
// });

// export default router;




import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './user.js';
import adminRoutes from './admin.js';
import authRoutes from './auth.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Location from '../models/Location.js';
import PetrolPump from '../models/PetrolPump.js';
import Registration from '../models/Registration.js';
import Notification from '../models/Notification.js';
import Feedback from '../models/Feedback.js';
import Nozzle from '../models/Nozzle.js';
import cron from 'node-cron';
const router = express.Router();

// Get all stations for the logged-in user
router.get('/api/stations', verifyToken, async (req, res) => {
  try {
    console.log('Fetching stations for user:', req.user);
    const userId = req.user.id || req.user._id; // Handle both `id` and `_id`
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    
    const stations = await PetrolPump.find({ 
      userid: mongoose.Types.ObjectId(userId) 
    }).lean();
    
    console.log(`Found ${stations.length} stations for user ${userId}`);
    res.json(stations);
  } catch (err) {
    console.error('Error fetching stations:', err);
    res.status(500).json({ 
      error: 'Failed to fetch stations', 
      details: err.message 
    });
  }
});

// Create or update nozzle configuration for a station
router.post('/api/nozzles', async (req, res) => {
  try {
    const { stationId, petrol, diesel, cng, electric, other } = req.body;
    if (!stationId) {
      return res.status(400).json({ error: 'stationId is required.' });
    }
    // Upsert logic: update if exists, create if not
    const update = {
      stationId,
      petrol: petrol || [],
      diesel: diesel || [],
      cng: cng || [],
      electric: electric || [],
      other: other || []
    };
    const nozzleDoc = await Nozzle.findOneAndUpdate(
      { stationId: String(stationId) },
      update,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(200).json(nozzleDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get nozzle configuration for a station
router.get('/api/nozzles/:stationId', async (req, res) => {
  try {
    const { stationId } = req.params;
    if (!stationId) return res.status(400).json({ error: 'stationId is required' });
    const nozzleDoc = await Nozzle.findOne({ stationId: String(stationId) });
    if (!nozzleDoc) return res.status(404).json({ error: 'No nozzle config found for this station' });
    res.json(nozzleDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update nozzle configuration for a station
router.put('/api/nozzles/:stationId', async (req, res) => {
  try {
    const { stationId } = req.params;
    const { petrol, diesel, cng, electric, other } = req.body;
    if (!stationId) {
      return res.status(400).json({ error: 'stationId is required.' });
    }
    // Only update if exists
    const existing = await Nozzle.findOne({ stationId: String(stationId) });
    if (!existing) return res.status(404).json({ error: 'No nozzle config found for this station' });
    existing.petrol = petrol || [];
    existing.diesel = diesel || [];
    existing.cng = cng || [];
    existing.electric = electric || [];
    existing.other = other || [];
    await existing.save();
    res.status(200).json(existing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete nozzle configuration for a station
router.delete('/api/nozzles/:stationId', async (req, res) => {
  try {
    const { stationId } = req.params;
    if (!stationId) return res.status(400).json({ error: 'stationId is required' });
    const result = await Nozzle.findOneAndDelete({ stationId: String(stationId) });
    if (!result) return res.status(404).json({ error: 'No nozzle config found to delete for this station' });
    res.json({ message: 'Nozzle configuration deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
import Employee from '../models/Employee.js';
import Session from '../models/Session.js'; // Import Session model

// Mount routes (order matters)
router.use('/auth', authRoutes);  // Authentication routes (login, register, etc.)
router.use('/user', verifyToken, userRoutes);  // Protected user routes
router.use('/admin', verifyToken, isAdmin, adminRoutes);  // Protected admin routes

// Dashboard: Get overview stats and recent data
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const todayStart = new Date('2025-06-01T00:00:00.000Z');
    const todayEnd = new Date('2025-06-01T23:59:59.999Z');
    const userId = req.user.id || req.user._id;

    // Only count stations belonging to the logged-in user
    const totalStations = await PetrolPump.countDocuments({ userid: userId });
    
    // For admin users, you might want to show all users, but for regular users, show only their own data
    const userFilter = req.user.role === 'admin' ? {} : { _id: userId };
    const totalUsers = await User.countDocuments(userFilter);
    
    // Only count today's bookings for this user's stations
    const userStations = await PetrolPump.find({ userid: userId }).select('_id');
    const stationIds = userStations.map(station => station._id);
    
    const todaysBookings = await Booking.countDocuments({
      station: { $in: stationIds },
      dateofbook: { $gte: todayStart, $lte: todayEnd }
    });
    
    const activeAlerts = 0; // Placeholder; derive from bookings/petrolpumps if needed

    // Only fetch bookings for the logged-in user
    const recentBookings = await Booking.find({ userid: req.user.id })
      .populate('userid', 'username')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('vehicle quantity dateofbook time location fueltype');

    const latestNotification = recentBookings.length > 0
      ? `Low fuel booking by ${recentBookings[0].userid?.username || 'Unknown'} at ${recentBookings[0].location}`
      : 'No recent notifications';

    res.json({
      totalStations,
      totalUsers,
      todaysBookings,
      activeAlerts,
      recentBookings,
      latestNotification
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Employees: Get stats and list
router.get('/employees/stats', async (req, res) => {
  try {
    const total = await User.countDocuments();
    const active = await User.countDocuments({ status: 'active' });
    const inactive = await User.countDocuments({ status: 'inactive' });
    res.json({ total, active, inactive });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/employees', verifyToken, async (req, res) => {
  try {
    // Find all stations owned by the logged-in user
    const userStations = await PetrolPump.find({ userid: req.user.id }).select('_id');
    const stationIds = userStations.map(station => station._id);
    // Filter employees whose station is in user's stations
    const filter = { station: { $in: stationIds } };
    if (req.query.stationId) {
      filter.station = req.query.stationId;
    }
    const employees = await Employee.find(filter).select('_id name mobile role shift station');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/employees', verifyToken, async (req, res) => {
  try {
    const { name, role, mobile, shift, station } = req.body;
    console.log('Incoming employee POST data:', req.body);

    // Validate inputs
    if (!name || !role || !mobile || !shift || !station) {
      console.error('Validation failed: missing fields');
      return res.status(400).json({ error: 'All fields (including station) are required.' });
    }
    if (!/^[0-9]{10}$/.test(mobile)) {
      console.error('Validation failed: invalid mobile');
      return res.status(400).json({ error: 'Mobile number must be exactly 10 digits.' });
    }

    // Check if the station exists
    const stationExists = await PetrolPump.findById(station);
    if (!stationExists) {
      console.error('Referenced station does not exist:', station);
      return res.status(400).json({ error: 'Selected station does not exist. Please select a valid station.' });
    }

    // Create new employee
    const newEmployee = new Employee({
      name,
      role,
      mobile,
      shift,
      station
    });

    await newEmployee.save();
    res.status(201).json({ message: 'Employee added successfully', employee: newEmployee });
  } catch (err) {
    console.error('Error saving employee:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

router.delete('/employees/:id', verifyToken, async (req, res) => {
  try {
    // Only allow admin to delete employees
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You are not authorized to delete this employee.' });
    }
    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found.' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bookings: Get stats and list
router.get('/bookings/stats', async (req, res) => {
  try {
    const total = await Booking.countDocuments();
    const completed = await Booking.countDocuments({ status: 'completed' });
    const pending = await Booking.countDocuments({ status: 'pending' });
    const cancelled = await Booking.countDocuments({ status: 'cancelled' });
    res.json({ total, completed, pending, cancelled });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/bookings', async (req, res) => {
  try {
    const { tab, search, stationId } = req.query;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    let query = {};
    if (tab === 'today') {
      query.dateofbook = { $gte: todayStart, $lte: todayEnd };
    } else if (tab === 'cancelled') {
      query.status = 'cancelled';
    } else {
      query.dateofbook = { $lt: todayEnd }; // Alltimebooking
    }

    if (stationId) {
      query.station = stationId;
    }

    if (search) {
      const users = await User.find({ username: new RegExp(search, 'i') }).select('_id');
      const userIds = users.map(user => user._id);
      query.userid = { $in: userIds };
    }

    
    // Ensure bookings are filtered by logged-in user
    if (!query.userid) query.userid = req.user.id;
    const bookings = await Booking.find(query)
      .populate('userid', 'username')
      .populate('station', 'name')
      .select('_id userid location fueltype dateofbook time amount status station');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Booking stats for a station
router.get('/bookings/stats', async (req, res) => {
  try {
    const { stationId } = req.query;
    if (!stationId) return res.status(400).json({ error: 'stationId is required' });
    const total = await Booking.countDocuments({ station: stationId });
    const completed = await Booking.countDocuments({ station: stationId, status: 'completed' });
    const pending = await Booking.countDocuments({ station: stationId, status: 'pending' });
    const cancelled = await Booking.countDocuments({ station: stationId, status: 'cancelled' });
    res.json({ total, completed, pending, cancelled });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Notifications: Use Notification collection
router.get('/notifications/stats', async (req, res) => {
  try {
    const total = await Notification.countDocuments();
    const unread = await Notification.countDocuments({ status: 'Unread' });
    const read = await Notification.countDocuments({ status: 'Read' });
    res.json({ total, unread, read });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch notifications for the logged-in user, filtered by user's stations
router.get('/notifications', verifyToken, async (req, res) => {
  try {
    console.log('=== FETCH NOTIFICATIONS REQUEST ===');
    console.log('User ID:', req.user.id);
    console.log('Query params:', req.query);
    
    // First, get all stations owned by the user
    let userStations;
    try {
      userStations = await PetrolPump.find({ userid: req.user.id }).lean();
      console.log('User stations from DB:', JSON.stringify(userStations, null, 2));
    } catch (dbErr) {
      console.error('Error fetching user stations:', dbErr);
      return res.status(500).json({ 
        error: 'Database error fetching stations',
        details: dbErr.message 
      });
    }
    
    if (!userStations || userStations.length === 0) {
      console.log('No stations found for user');
      return res.json([]);
    }
    
    // Get station IDs the user has access to
    const stationIds = userStations.map(station => station._id.toString());
    console.log('Station IDs user has access to:', stationIds);
    
    // If a specific station is requested, verify the user has access to it
    const { stationId } = req.query;
    console.log('Requested stationId:', stationId);
    
    if (stationId) {
      try {
        // Convert stationId to string for comparison
        const stationIdStr = stationId.toString();
        
        if (!stationIds.includes(stationIdStr)) {
          console.log('Access denied - user does not have access to station:', stationIdStr);
          return res.status(403).json({ 
            error: 'Access to the specified station is denied',
            userStations: stationIds,
            requestedStation: stationIdStr
          });
        }
        
        // Fetch only notifications for the specified station
        console.log('Fetching notifications for station:', stationIdStr);
        const query = { stationId: stationIdStr };
        console.log('MongoDB query:', JSON.stringify(query));
        
        const notifications = await Notification.find(query).sort({ date: -1 }).lean();
        console.log(`Found ${notifications.length} notifications for station ${stationIdStr}`);
        
        return res.json(notifications);
        
      } catch (queryErr) {
        console.error('Error querying notifications:', queryErr);
        return res.status(500).json({
          error: 'Error querying notifications',
          details: queryErr.message,
          stack: process.env.NODE_ENV === 'development' ? queryErr.stack : undefined
        });
      }
    }
    
    // If no specific station is requested, get notifications for all user's stations
    try {
      console.log('Fetching notifications for all user stations:', stationIds);
      const query = { stationId: { $in: stationIds } };
      console.log('MongoDB query:', JSON.stringify(query));
      
      const notifications = await Notification.find(query).sort({ date: -1 }).lean();
      console.log(`Found ${notifications.length} total notifications`);
      
      return res.json(notifications);
      
    } catch (bulkQueryErr) {
      console.error('Error in bulk notifications query:', bulkQueryErr);
      return res.status(500).json({
        error: 'Error fetching notifications',
        details: bulkQueryErr.message,
        stationIds: stationIds,
        query: { stationId: { $in: stationIds } }
      });
    }
    
  } catch (err) {
    console.error('Unhandled error in /notifications endpoint:', {
      error: err,
      message: err.message,
      stack: err.stack,
      user: req.user ? { id: req.user.id } : 'No user in request'
    });
    
    return res.status(500).json({
      error: 'Internal server error',
      message: err.message,
      ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
    });
  }
});

// Create notification
router.post('/notifications', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the token
    const { title, message, status, stationId } = req.body;
    if (!stationId) {
      return res.status(400).json({ error: 'stationId is required' });
    }

    // Generate notificationCode (optional display code)
    let notificationCode = 'NOT-001';
    const lastNotification = await Notification.findOne().sort({ date: -1 });
    if (lastNotification && lastNotification.notificationCode) {
      const lastNum = parseInt(lastNotification.notificationCode.replace(/\D/g, ''));
      if (!isNaN(lastNum)) {
        notificationCode = `NOT-${String(lastNum + 1).padStart(3, '0')}`;
      }
    }

    // Lookup station name
    let stationName = 'Unknown Station';
    if (!mongoose.Types.ObjectId.isValid(stationId)) {
      console.error('Invalid stationId:', stationId);
      return res.status(400).json({ error: 'Invalid stationId format' });
    }
    const stationDoc = await PetrolPump.findById(stationId);
    if (!stationDoc) {
      console.error('Station not found for ID:', stationId);
      return res.status(404).json({ error: 'Station not found for the given stationId' });
    }
    stationName = stationDoc.name || stationDoc.stationName || 'Unknown Station';

    const newNotification = new Notification({
      notificationCode,
      userId, // Save with user ID for isolation
      title,
      message,
      stationId,
      stationName,
      status,
      date: new Date()
    });

    await newNotification.save();
    res.status(201).json({ message: 'Notification added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/notifications/:id', async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Feedback: Use Feedback collection
router.get('/feedback/stats', async (req, res) => {
  try {
    const total = await Feedback.countDocuments();
    const positive = await Feedback.countDocuments({ rating: 'Positive' });
    const negative = await Feedback.countDocuments({ rating: 'Negative' });
    res.json({ total, positive, negative });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/feedback', async (req, res) => {
  try {
    // Only fetch feedback for the logged-in user
    const feedback = await Feedback.find({ userid: req.user.id });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/feedback', async (req, res) => {
  try {
    const { customer, rating, comment } = req.body;
    const lastFeedback = await Feedback.findOne().sort({ _id: -1 });
    const lastId = lastFeedback ? parseInt(lastFeedback._id.toString().slice(-3)) : 0;
    const newId = `FB-${String(lastId + 1).padStart(3, '0')}`;
    const newFeedback = new Feedback({
      _id: newId,
      customer,
      rating,
      comment,
      date: new Date()
    });
    await newFeedback.save();
    res.status(201).json({ message: 'Feedback added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/feedback/:id', async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Nozzles: Use Nozzle collection
router.get('/nozzles', async (req, res) => {
  try {
    const nozzleConfigs = await Nozzle.find({
      $or: [
        { 'nozzles.petrol': { $gt: 1 } },
        { 'nozzles.diesel': { $gt: 1 } },
        { 'nozzles.cng': { $gt: 1 } },
        { 'nozzles.electric': { $gt: 1 } },
        { 'nozzles.other': { $gt: 1 } }
      ]
    });

    res.json(nozzleConfigs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/nozzles', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the token
    const { stationId, nozzles = {}, prices = {} } = req.body;

    // Validate inputs
    if (!stationId) {
      return res.status(400).json({ error: 'Station ID is required.' });
    }

    // Ensure nozzles and prices are objects with default values
    const defaultNozzles = { petrol: 0, diesel: 0, cng: 0, electric: 0, other: 0 };
    const defaultPrices = { petrol: 0, diesel: 0, cng: 0, electric: 0, other: 0 };

    const sanitizedNozzles = { ...defaultNozzles, ...nozzles };
    const sanitizedPrices = { ...defaultPrices, ...prices };

    // Save configuration to the database
    const newNozzleConfig = new Nozzle({
      userId,
      stationId,
      nozzles: sanitizedNozzles,
      prices: sanitizedPrices
    });
    await newNozzleConfig.save();

    res.status(201).json({ message: 'Nozzle configuration saved successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/nozzles', async (req, res) => {
  try {
    await Nozzle.deleteMany({});
    res.json({ message: 'Nozzle configuration deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stations: Get list and manage
// Get a single station by ID
router.get('/stations/:id', async (req, res) => {
  try {
    const station = await PetrolPump.findById(req.params.id);
    if (!station) return res.status(404).json({ error: 'Station not found.' });
    res.json(station);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a station's status
router.patch('/stations/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['active', 'inactive', 'maintenance'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be one of: active, inactive, maintenance' });
    }

    const updatedStation = await PetrolPump.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedStation) {
      return res.status(404).json({ error: 'Station not found' });
    }

    res.json(updatedStation);
  } catch (err) {
    console.error('Error updating station status:', err);
    res.status(500).json({ error: 'Failed to update station status', details: err.message });
  }
});

// Update a single station by ID
router.put('/stations/:id', verifyToken, async (req, res) => {
  try {
    const station = await PetrolPump.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!station) return res.status(404).json({ error: 'Station not found.' });
    res.json(station);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// router.get('/stations', verifyToken, async (req, res) => {
//   try {
//     const { search } = req.query;
//     let query = {};
    
//     if (search) {
//       query.$or = [
//         { name: new RegExp(search, 'i') },
//         { operator: new RegExp(search, 'i') },
//         { contact: new RegExp(search, 'i') },
//         { $and: [{ lat: { $exists: true }, lon: { $exists: true } }], location: new RegExp(search, 'i') }
//       ];
//     }
    
//     // Only fetch petrol pumps for the logged-in user
//     if (!query.userid) query.userid = req.user.id;
    
//     const petrolPumps = await PetrolPump.find(query).populate('userid', 'username');
//     res.json(petrolPumps);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });








router.post('/stations', verifyToken, async (req, res) => {
  try {
    const userid = req.user.id; // Extract user ID from the token
    const { name, location, contact, upiId, status = 'active', fuelTypes = [] } = req.body;
    
    if (!location || !upiId) {
      return res.status(400).json({ error: 'Location and UPI ID are required' });
    }
    
    const [lat, lon] = location.split(',').map(coord => parseFloat(coord.trim()));

    const newPetrolPump = new PetrolPump({
      userid,
      lat,
      lon,
      name,
      operator: 'UnknownOperator',
      contact,
      upiId,
      status,
      fuelTypes: Array.isArray(fuelTypes) ? fuelTypes : [] // Ensure fuelTypes is an array
    });

    await newPetrolPump.save();
    res.status(201).json({ message: 'Station added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// router.get('/stations', verifyToken, async (req, res) => {
//   try {
//     const { search } = req.query;
//     let query = {};

//     if (req.user.role !== 'admin') {
//       query.userid = req.user.id;
//     } else {
//       query.userid = null;
//     }

//     if (search) {
//       query.$or = [
//         { name: new RegExp(search, 'i') },
//         { operator: new RegExp(search, 'i') },
//         { contact: new RegExp(search, 'i') },
//         {
//           $and: [
//             { lat: { $exists: true } },
//             { lon: { $exists: true } },
//             { location: new RegExp(search, 'i') }
//           ]
//         }
//       ];
//     }

//     console.log('Final query to DB:', query); // ⬅️ Add this to check what's being sent

//     const petrolPumps = await PetrolPump.find(query).populate('userid', 'username');
//     res.json(petrolPumps);
//   } catch (err) {
//     console.error('❌ Error in /stations route:', err); // ⬅️ LOG FULL ERROR
//     res.status(500).json({ error: err.message });
//   }
// });








router.get('/stations', verifyToken, async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    // ⛔ REMOVE THIS LINE — it restricts to logged-in user only
    // if (!query.userid) query.userid = req.user.id;

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { operator: new RegExp(search, 'i') },
        { contact: new RegExp(search, 'i') },
        { $and: [{ lat: { $exists: true }, lon: { $exists: true } }], location: new RegExp(search, 'i') }
      ];
    }

    // ✅ Only fetch stations with lat/lon present (optional)
    query.lat = { $ne: null };
    query.lon = { $ne: null };

    const petrolPumps = await PetrolPump.find(query).populate('userid', 'username');
    res.json(petrolPumps);
  } catch (err) {
    console.error('Error in /stations:', err); // Log detailed error
    res.status(500).json({ error: err.message });
  }
});


router.delete('/stations/:id', verifyToken, async (req, res) => {
  try {
    const station = await PetrolPump.findById(req.params.id);
    if (!station) {
      return res.status(404).json({ error: 'Station not found.' });
    }
    // Allow only owner or admin
    if (station.userId?.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You are not authorized to delete this station.' });
    }
    await PetrolPump.findByIdAndDelete(req.params.id);
    res.json({ message: 'Station deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Updated route to handle string stationId
router.post('/stations/:stationId/nozzles', verifyToken, async (req, res) => {
    try {
        const { stationId } = req.params;
        const { nozzles, prices } = req.body;

        console.log('Request received:', { stationId, nozzles, prices });
        console.log('Token from request:', req.header('Authorization'));

        // Validate stationId
        const objectIdStationId = mongoose.Types.ObjectId.isValid(stationId) ? new mongoose.Types.ObjectId(stationId) : null;
        if (!objectIdStationId) {
            console.error('Invalid station ID format:', stationId);
            return res.status(400).json({ error: 'Invalid station ID format.' });
        }

        // Fetch the PetrolPump document
        const station = await PetrolPump.findById(stationId);
        if (!station) {
            console.error('Station not found:', stationId);
            return res.status(404).json({ error: 'Station not found.' });
        }

        // Update nozzles and prices
        station.nozzles = nozzles;
        station.prices = prices;

        // Save the updated document
        await station.save();

        console.log('Nozzle configuration saved successfully:', { stationId, nozzles, prices });
        res.status(200).json({ message: 'Nozzle configuration saved successfully.' });
    } catch (err) {
        console.error('Error saving nozzle configuration:', err);
        res.status(500).json({ error: err.message });
    }
});

// Route to fetch nozzle configuration for a specific station
router.get('/stations/:stationId/nozzles', verifyToken, async (req, res) => {
    try {
        const { stationId } = req.params;

        // Find the station
        const station = await PetrolPump.findById(stationId);
        if (!station) {
            return res.status(404).json({ error: 'Station not found.' });
        }

        res.status(200).json({ nozzles: station.nozzles, prices: station.prices });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to update nozzle configuration for a specific station
router.put('/stations/:stationId/nozzles', verifyToken, async (req, res) => {
    try {
        const { stationId } = req.params;
        const { nozzles, prices } = req.body;

        // Validate inputs
        if (!nozzles || !prices) {
            return res.status(400).json({ error: 'Nozzles and prices are required.' });
        }

        // Find the station
        const station = await PetrolPump.findById(stationId);
        if (!station) {
            return res.status(404).json({ error: 'Station not found.' });
        }

        // Update nozzle configuration
        station.nozzles = nozzles;
        station.prices = prices;
        await station.save();

        res.status(200).json({ message: 'Nozzle configuration updated successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});





// Add employee
router.post('/api/employees', async (req, res) => {
  try {
    const { name, mobile, role, shift, station } = req.body;
    if (!name || !mobile || !role || !shift || !station) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (!/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({ error: 'Mobile must be 10 digits' });
    }
    const employee = new Employee({ name, mobile, role, shift, station });
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    console.error('Add employee error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Only show employees for current user
router.get('/api/employees', verifyToken, async (req, res) => {

// Delete employee (only if station belongs to user)
router.delete('/api/employees/:id', verifyToken, async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ error: 'Employee not found' });
    // Find all stations owned by this user
    const pumps = await PetrolPump.find({ userid: req.user.id || req.user._id });
    const pumpIds = pumps.map(p => p._id.toString());
    if (!pumpIds.includes(emp.station.toString())) {
      return res.status(403).json({ error: 'Not authorized to delete this employee' });
    }
    await emp.deleteOne();
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

  try {
    // Find all stations owned by this user
    const pumps = await PetrolPump.find({ userid: req.user.id || req.user._id });
    const pumpIds = pumps.map(p => p._id);
    // Find employees whose station is in user's pumps
    const employees = await Employee.find({ station: { $in: pumpIds } }).populate('station');
    res.json(employees);
  } catch (err) {
    console.error('[Notification Cleanup] Error deleting old notifications:', err);
  }
});

export default router;