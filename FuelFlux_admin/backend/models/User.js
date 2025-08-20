import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
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
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
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
    status: {
        type: String,
        enum: ['active', 'inactive', 'blocked'],
        default: 'active'
    },
    role: {
        type: String,
        default: 'customer',
        immutable: true
    },
    profile: {
        firstName: String,
        lastName: String,
        address: String,
        city: String,
        state: String,
        pincode: String
    },    vehicles: [{
        type: {
            type: String,
            enum: ['2-wheeler', '4-wheeler', 'commercial', 'other']
        },
        fuelType: {
            type: String,
            enum: ['petrol', 'diesel', 'cng', 'electric']
        },
        registrationNumber: {
            type: String,
            sparse: true,
            index: true
        },
        model: String
    }],
    preferredStations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PetrolPump'
    }],
    lastBooking: {
        type: Date,
        index: true
    },
    totalBookings: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // This will automatically handle createdAt and updatedAt
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Add compound index for performance
userSchema.index({ email: 1, status: 1 });

export default mongoose.model('User', userSchema);