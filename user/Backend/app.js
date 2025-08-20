 

// const express = require('express');
// const app = express();
// const connectDB = require('./config/db');
// const cors = require('cors');
// const path = require('path');

// // const dotenv = require('dotenv');
// // dotenv.config();
// require('dotenv').config(); 

// connectDB();
// const cookieParser = require('cookie-parser');
// const session = require('express-session');
// const passport = require('passport');
// require('./config/passwordConfig');

// // CORS middleware must come first
// // Update your CORS configuration to be more permissive during development
// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true, // This is crucial
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie']
// }));
// app.use(express.json());
// // This should come BEFORE your routes
 
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// // Update session configuration
// app.use(session({
//     secret: process.env.JWT_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         secure: false, // true in production with HTTPS
//         httpOnly: true,
//         sameSite: 'lax',
//         maxAge: 24 * 60 * 60 * 1000 // 24 hours
//     }
// }));
// app.use(passport.initialize());
// app.use(passport.session());
 

// app.use('/api/users', require('./routes/UserRoutes'));
// app.use('/api/location' , require('./routes/Location'));
// app.use('/api/stations' , require('./routes/stations'));
// app.use('/api/booking', require('./routes/BookingRoute'));
// app.use('/api/registration', require('./routes/RegistrationRoute'));
// app.use('/api/registrationno' , require('./routes/RegisterNo'))

// // Serve frontend build in production
// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, '../frontend/dist'))); // Adjust path if needed

//     // Fallback: send index.html for any route not handled by Express
//     app.get('*', (req, res) => {
//         res.sendFile(path.join(__dirname, '../frontend/dist/index.html')); // Adjust path if needed
//     });
// }

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on ${PORT}`);
// });
 

const express = require('express');
const app = express();
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();
const path = require('path'); //

connectDB();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
require('./config/passwordConfig');

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/users', require('./routes/UserRoutes'));
app.use('/api/location', require('./routes/Location'));
app.use('/api/stations', require('./routes/stations'));
app.use('/api/booking', require('./routes/BookingRoute'));
app.use('/api/registration', require('./routes/RegistrationRoute'));
app.use('/api/registrationno', require('./routes/RegisterNo'));
app.use('/api/payments', require('./routes/PaymentRoute'));
app.use('/api/feed', require('./routes/FeedBackroute'));

// ✅ Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist'))); // or build

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
