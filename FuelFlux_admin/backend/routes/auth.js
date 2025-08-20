import express from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import { verifyToken, isAdmin, signToken } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_2025';

// Rate limiting for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // increased from 5 to 100 attempts
    message: { success: false, error: 'Too many login attempts. Please try again after 15 minutes.' }
});

// Admin Authentication
router.post('/admin/login', loginLimiter, express.json(), async (req, res) => {
    console.log('\n=== Login Request ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Content-Type header:', req.get('Content-Type'));
    
    // Log raw body for debugging
    let rawBody = '';
    req.on('data', chunk => {
        rawBody += chunk.toString();
    });
    req.on('end', () => {
        console.log('Raw request body:', rawBody);
    });
    
    let { email, password } = req.body;
    
    // Enforce admin email suffix
    if (!email) {
        console.log('No email provided');
        return res.status(400).json({ success: false, error: 'Email is required' });
    }
    
    // Normalize email
    email = email.trim().toLowerCase();
    if (!email.endsWith('@admin.com')) {
        console.log('Invalid email format (missing @admin.com)');
        return res.status(400).json({ success: false, error: 'Admin login requires an @admin.com email.' });
    }
    
    try {
        console.log('Processing login for email:', email);

        // Ensure email has @admin.com
        email = email.includes('@admin.com') ? email : `${email}@admin.com`;
        console.log('Processed email:', email);

        // Find admin using our custom method with detailed logging
        console.log('\n=== Finding Admin ===');
        const admin = await Admin.findByEmail(email);
        
        if (!admin) {
            console.log(`No admin found with email: ${email}`);
            console.log('Available admins:');
            const allAdmins = await Admin.find({}).select('email username status -_id');
            console.log(allAdmins);
            
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
                debug: {
                    message: 'Admin not found',
                    searchedEmail: email,
                    availableAdmins: allAdmins
                }
            });
        }

        // Check password
        console.log('\n=== Password Check ===');
        console.log('Password provided:', password ? '[provided]' : 'not provided');
        console.log('Password length:', password?.length || 0);
        
        try {
            const isMatch = await admin.comparePassword(password);
            console.log('Password match:', isMatch);
            
            if (!isMatch) {
                console.log('Password does not match');
                return res.status(401).json({
                    success: false,
                    error: 'Invalid credentials'
                });
            }
        } catch (error) {
            console.error('Error comparing passwords:', error);
            return res.status(500).json({
                success: false,
                error: 'Error validating credentials'
            });
        }

        // Check account status
        if (admin.status !== 'active') {
            return res.status(403).json({
                success: false,
                error: 'Account is not active'
            });
        }

        // Update last login
        admin.lastLogin = new Date();
        await admin.save();

        // Generate JWT token with longer expiration
        const token = jwt.sign(
            {
                id: admin._id,
                email: admin.email,
                role: admin.role,
                type: 'admin'
            },
            JWT_SECRET,
            { expiresIn: '7d' } // Extended to 7 days
        );

        // Set cookie with proper options
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/'
        });

        console.log('Login successful, sending response');
        // Send response
        res.json({
            success: true,
            message: 'Login successful',
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
                permissions: admin.permissions
            },
            token // Include token in response for client-side storage if needed
            
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Error during login',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Admin Registration
// Rate limiting for registration
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // limit each IP to 10 register requests per windowMs
    message: { success: false, error: 'Too many registration attempts. Please try again later.' }
});

// Admin Registration
router.post('/admin/register', registerLimiter, express.json(), async (req, res) => {
    console.log('=== Admin Registration Request ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    try {
        const { username, email, password, phoneNumber, role = 'admin', permissions = [] } = req.body;

        // Log received data for debugging
        console.log('Parsed fields:', { username, email, phoneNumber, role });

        // Validate required fields with detailed error messages
        const missingFields = [];
        if (!username) missingFields.push('username');
        if (!email) missingFields.push('email');
        if (!password) missingFields.push('password');
        if (!phoneNumber) missingFields.push('phoneNumber');

        if (missingFields.length > 0) {
            console.log('Missing required fields:', missingFields);
            return res.status(400).json({
                success: false,
                error: 'All fields are required',
                missingFields: missingFields,
                message: `Please provide: ${missingFields.join(', ')}`
            });
        }

    // Normalize and validate email
    const normalizedEmail = email.trim().toLowerCase();
    console.log('Normalized email:', normalizedEmail);
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
        console.log('Invalid email format:', normalizedEmail);
        return res.status(400).json({ 
            success: false, 
            error: 'Please provide a valid email address' 
        });
    }
    
    // Enforce admin email suffix
    if (!normalizedEmail.endsWith('@admin.com')) {
        console.log('Non-admin email used:', normalizedEmail);
        return res.status(400).json({ 
            success: false, 
            error: 'Admin registration requires an @admin.com email address.',
            hint: 'Please use an email ending with @admin.com'
        });
    }

        // Validate phone number format
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
            console.log('Invalid phone number format:', phoneNumber);
            return res.status(400).json({
                success: false,
                error: 'Invalid phone number format',
                message: 'Please enter a valid 10-digit phone number (numbers only)'
            });
        }

        // Check if email already exists
        const existingAdmin = await Admin.findOne({ email: normalizedEmail });
        if (existingAdmin) {
            console.log('Email already in use:', normalizedEmail);
            return res.status(400).json({
                success: false,
                error: 'Email already registered',
                message: 'An admin with this email already exists. Please use a different email.'
            });
        }

        // Create new admin
        try {
            // Create the admin with plain password - the pre-save hook will hash it
            const newAdmin = new Admin({
                username: username.trim(),
                email: normalizedEmail,
                password: password, // Will be hashed by pre-save hook
                phoneNumber: phoneNumber.trim(),
                role: role,
                permissions: permissions,
                status: 'active'
            });
            
            console.log('New admin before save:', {
                username: newAdmin.username,
                email: newAdmin.email,
                passwordLength: newAdmin.password?.length,
                phoneNumber: newAdmin.phoneNumber
            });

            await newAdmin.save();
            console.log('Admin created successfully:', newAdmin.email);
            
            // Generate JWT token
            const token = jwt.sign(
                {
                    id: newAdmin._id,
                    email: newAdmin.email,
                    role: newAdmin.role,
                    type: 'admin'
                },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            // Set secure cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                path: '/'
            });

            return res.status(201).json({
                success: true,
                message: 'Admin registered successfully',
                admin: {
                    id: newAdmin._id,
                    username: newAdmin.username,
                    email: newAdmin.email,
                    role: newAdmin.role,
                    permissions: newAdmin.permissions
                },
                token
            });

        } catch (error) {
            console.error('Error creating admin:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to create admin account',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            error: 'An unexpected error occurred during registration',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }

    // Validate password length
    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            error: 'Password must be at least 6 characters long.'
        });
    }

    // Validate role
    if (!['super_admin', 'admin'].includes(role)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid role. Must be either "admin" or "super_admin".'
        });
    }
    try {
        // Check if admin with this email already exists
        const existingAdmin = await Admin.findOne({ email: normalizedEmail });
        if (existingAdmin) {
            console.log('Registration failed: Email already in use');
            return res.status(409).json({
                success: false,
                error: 'An admin with this email already exists.'
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin
        const newAdmin = new Admin({
            username: username.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            phoneNumber: phoneNumber.trim(),
            role,
            permissions,
            status: 'active'
        });

        // Save to database
        await newAdmin.save();
        console.log('Admin registered successfully:', { email: normalizedEmail, role });

        // Generate JWT token
        const token = jwt.sign(
            { id: newAdmin._id, email: newAdmin.email, role: newAdmin.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return success response with token (but not the password)
        const adminData = newAdmin.toObject();
        delete adminData.password;
        
        res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            token,
            admin: adminData
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle duplicate key error (unique email, username, or phone)
        if (error.code === 11000) {
            let errorMessage = 'An error occurred during registration.';
            
            // Try to determine which field caused the duplicate key error
            if (error.keyPattern && error.keyValue) {
                if (error.keyPattern.email) {
                    errorMessage = 'An admin with this email already exists.';
                } else if (error.keyPattern.phoneNumber) {
                    errorMessage = 'This phone number is already registered.';
                } else if (error.keyPattern.username) {
                    errorMessage = 'This username is already taken.';
                }
            }
            
            return res.status(409).json({
                success: false,
                error: errorMessage
            });
        }
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                error: messages.join(', ')
            });
        }
        
        // General error
        console.error('Unexpected error during registration:', error);
        return res.status(500).json({
            success: false,
            error: 'An unexpected error occurred during registration. Please try again later.'
        });
    }
});

// Logout route with proper cleanup
router.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0),
        path: '/'
    });
    res.json({ success: true, message: 'Logged out successfully' });
});

// Token verification with proper error handling
router.get('/verify', verifyToken, async (req, res) => {
    try {
        // Fetch admin user from DB to get username and email
        const admin = await Admin.findById(req.user.id);
        if (!admin) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.json({ 
            success: true, 
            user: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                type: req.user.type,
                role: req.user.role
            }
        });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(401).json({ 
            success: false, 
            error: 'Invalid token' 
        });
    }
});

// User Registration
router.post('/user/register', async (req, res) => {
  const { email } = req.body;
  // Block admin emails from user registration
  if (email && email.toLowerCase().endsWith('@admin.com')) {
    return res.status(403).json({ success: false, error: 'Cannot register @admin.com email as a user.' });
  }
  try {
    const { username, email, password, phone } = req.body;
    if (!username || !email || !password || !phone) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }
    const existingUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }, { phoneNumber: phone }] });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists with this email, username, or phone' });
    }
    const user = new User({ username, email: email.toLowerCase(), password, phoneNumber: phone, role: 'user', status: 'active' });
    await user.save();
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// User Login
router.post('/user/login', async (req, res) => {
  const { email } = req.body;
  // Block admin emails from user login
  if (email && email.toLowerCase().endsWith('@admin.com')) {
    return res.status(403).json({ success: false, error: 'Cannot login as user with @admin.com email.' });
  }
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    if (user.status !== 'active') {
      return res.status(403).json({ success: false, error: 'Account is not active' });
    }
    // Optionally generate a token here if needed
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
      // Add token if needed
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error during login' });
  }
});

export default router;
