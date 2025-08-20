import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return v.endsWith('@admin.com');
            },
            message: 'Email must end with @admin.com'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long']
    },
    phoneNumber: {
        type: String,
        required: true,
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },
    role: {
        type: String,
        enum: ['super_admin', 'admin'],
        default: 'admin'
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    permissions: [{
        type: String,
        enum: [
            'manage_stations',
            'manage_employees',
            'manage_bookings',
            'manage_nozzles',
            'view_reports',
            'manage_notifications',
            'manage_feedback'
        ]
    }],
    lastLogin: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
adminSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
adminSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        console.log('\n=== Password Comparison ===');
        console.log('Candidate password:', candidatePassword ? '[provided]' : 'undefined');
        console.log('Candidate password length:', candidatePassword?.length);
        console.log('Hashed password exists:', !!this.password);
        console.log('Hashed password length:', this.password?.length);
        
        if (!candidatePassword) {
            console.log('No password provided for comparison');
            return false;
        }
        
        if (!this.password) {
            console.log('No hashed password found for this user');
            return false;
        }
        
        const result = await bcrypt.compare(candidatePassword, this.password);
        console.log('Password comparison result:', result);
        
        if (!result) {
            console.log('Password does not match');
        } else {
            console.log('Password matches!');
        }
        
        return result;
    } catch (error) {
        console.error('Password comparison error:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
        throw error;
    }
};

// Add static method to find admin with logging
adminSchema.statics.findByEmail = async function(email) {
    console.log('\n=== Admin.findByEmail ===');
    console.log('Searching for email:', email);
    
    try {
        const admin = await this.findOne({ email: email.toLowerCase().trim() });
        console.log('Admin found:', admin ? 'Yes' : 'No');
        if (admin) {
            console.log('Admin details:', {
                _id: admin._id,
                email: admin.email,
                username: admin.username,
                status: admin.status
            });
        }
        return admin;
    } catch (error) {
        console.error('Error finding admin by email:', error);
        throw error;
    }
};

// Get the default connection
const db = mongoose.connection;

// Log connection events
db.on('connected', () => {
    console.log('Mongoose connected to database:', db.name);
    
    // Log all admins after connection is established
    mongoose.model('Admin', adminSchema, 'admins').find({}).then(admins => {
        console.log('\n=== All Admin Users in Database ===');
        console.log(`Total admins: ${admins.length}`);
        admins.forEach(admin => {
            console.log(`- ${admin.email} (${admin.username}) - Status: ${admin.status}`);
        });
    }).catch(err => {
        console.error('Error fetching all admins:', err);
    });
});

db.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

// Create the model with explicit collection name
const Admin = mongoose.model('Admin', adminSchema, 'admins');

export default Admin;
