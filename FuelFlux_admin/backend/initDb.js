import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Admin from './models/Admin.js';
import Notification from './models/Notification.js';
import dotenv from 'dotenv';

dotenv.config();

const initializeDatabase = async () => {
    try {
        const mongooseOptions = {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,
            connectTimeoutMS: 5000,
            autoIndex: true,
            minPoolSize: 3,
            maxPoolSize: 10,
        };

        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/FUELFLUX', mongooseOptions);
        console.log('Connected to MongoDB');

        // Check if admin exists
        const adminExists = await Admin.findOne({ email: 'admin@admin.com' });
        if (!adminExists) {
            // Create default admin
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const defaultAdmin = new Admin({
                username: 'Admin',
                email: 'admin@admin.com',
                password: hashedPassword,
                phoneNumber: '1234567890',
                role: 'super_admin',
                status: 'active',
                permissions: [
                    'manage_stations',
                    'manage_employees',
                    'manage_bookings',
                    'manage_nozzles',
                    'view_reports',
                    'manage_notifications',
                    'manage_feedback'
                ]
            });

            await defaultAdmin.save();
            console.log('Default admin user created successfully');
            console.log('Email: admin@admin.com');
            console.log('Password: admin123');
        } else {
            console.log('Admin user already exists');
        }

        await mongoose.connection.close();
        console.log('Database initialization completed');
        process.exit(0);
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
};

const resetNotificationsCollection = async () => {
    try {
        const mongooseOptions = {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,
            connectTimeoutMS: 5000,
            autoIndex: true,
            minPoolSize: 3,
            maxPoolSize: 10,
        };

        const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/FUELFLUX';
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri, mongooseOptions);
        console.log('Connected to MongoDB successfully');

        // Drop the existing notifications collection using Mongoose's model methods
        await Notification.collection.drop().catch((error) => {
            if (error.message.includes('ns not found')) {
                console.log('Notifications collection does not exist, skipping drop');
            } else {
                throw error;
            }
        });

        console.log('Dropped notifications collection');

        // Recreate the collection with the updated schema
        const newNotification = new Notification({
            _id: 'test',
            title: 'Test Notification',
            message: 'This is a test notification.',
            status: 'Active',
        });

        await newNotification.save();
        console.log('Recreated notifications collection with updated schema');
    } catch (error) {
        console.error('Error resetting notifications collection:', error);
    }
};

initializeDatabase();
await resetNotificationsCollection();
