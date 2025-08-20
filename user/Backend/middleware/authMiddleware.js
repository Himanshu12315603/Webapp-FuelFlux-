const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
// This should come BEFORE your routes
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());


// function isLoggedIn(req, res, next) {
//     const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
//     if (!token) {
//         return res.status(401).json({ error: "Unauthorized: No token provided" });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (err) {
//         return res.status(401).json({ error: "Unauthorized: Invalid token" });
//     }
// }

 
const isLoggedIn = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // decoded should contain userid, email, etc.
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

module.exports = isLoggedIn;


 

