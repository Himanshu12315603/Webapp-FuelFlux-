import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_2025';

// Verify JWT token
export const verifyToken = async (req, res, next) => {
    console.log('Auth check for path:', req.path);
    
    // Skip token verification for public routes and assets
    if (
        req.path === '/api/admin/login' ||
        req.path === '/api/user/login' ||
        req.path.includes('/api/auth/login') || 
        req.path.includes('/api/auth/register') ||
        req.path.includes('.css') ||
        req.path.includes('.js') ||
        req.path.includes('.ico')
    ) {
        console.log('Skipping auth check for public route/asset');
        return next();
    }

    let token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token present:', !!token);
    
    // If no token, return unauthorized for API routes
    if (!token) {
        console.log('No token found');
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({ 
                success: false, 
                error: 'Access denied. No token provided.' 
            });
        }
        // For non-API routes, proceed to let React handle the routing
        return next();
    }

    try {
        console.log('Verifying token...');
        // Remove any quotes from the token
        token = token.replace(/^"|"$/g, '');
        
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        if (!decoded) {
            throw new Error('Invalid token: Could not decode');
        }
        
        console.log('Token verified for user ID:', decoded.id || 'unknown');
        
        // Set the user object with default values if they don't exist
        req.user = {
            id: decoded.id,
            email: decoded.email || 'unknown@example.com',
            type: decoded.type || 'user',
            ...decoded
        };

        // Verify user exists in database
        if (decoded.type === 'admin') {
            const admin = await Admin.findById(decoded.id).select('-password');
            if (!admin || admin.status !== 'active') {
                console.log('Admin verification failed:', !admin ? 'not found' : 'inactive');
                throw new Error(admin ? 'Account is inactive' : 'Admin not found');
            }
            console.log('Admin verified:', admin.email);
            req.admin = admin;
            req.user = { ...decoded, id: admin._id };

            // Refresh token if it's close to expiring (within 24 hours)
            const tokenExp = new Date(decoded.exp * 1000);
            const now = new Date();
            const hoursUntilExpiration = (tokenExp - now) / (1000 * 60 * 60);
            
            if (hoursUntilExpiration < 24) {
                console.log('Refreshing token');
                const newToken = jwt.sign(
                    {
                        id: admin._id,
                        email: admin.email,
                        role: admin.role,
                        type: 'admin'
                    },
                    JWT_SECRET,
                    { expiresIn: '7d' }
                );
                
                res.cookie('token', newToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    path: '/'
                });
            }
        } else {
            const user = await User.findById(decoded.id).select('-password');
            if (!user || user.status !== 'active') {
                console.log('User verification failed:', !user ? 'not found' : 'inactive');
                throw new Error(user ? 'Account is inactive' : 'User not found');
            }
            req.user = user;
        }
        
        // Set cache control headers
        res.set({
            'Cache-Control': 'no-store, no-cache, must-revalidate, private',
            'Expires': '-1',
            'Pragma': 'no-cache'
        });
        
        console.log('Auth check passed, proceeding...');
        next();
    } catch (error) {
        console.error('Auth error:', error.message);
        // Clear invalid token
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });
        
        // Return error for API routes, let React handle routing for non-API routes
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({ 
                success: false, 
                error: error.message || 'Invalid token' 
            });
        }
        // For non-API routes, proceed to let React handle the routing
        return next();
    }
};

// Check if user is admin
export const isAdmin = async (req, res, next) => {
    try {
        if (!req.admin || req.user?.type !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: 'Error verifying admin status' });
    }
};

// Check if user is super admin
export const isSuperAdmin = async (req, res, next) => {
    try {
        if (!req.admin || req.admin.role !== 'super_admin') {
            return res.status(403).json({ error: 'Access denied. Super Admin only.' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: 'Error verifying super admin status' });
    }
};

// Check if user has required permission
export const hasPermission = (permission) => {
    return async (req, res, next) => {
        try {
            if (!req.admin) {
                return res.status(403).json({ error: 'Access denied. Admin only.' });
            }

            // Super admin has all permissions
            if (req.admin.role === 'super_admin') {
                return next();
            }

            // Check if admin has the required permission
            if (!req.admin.permissions?.includes(permission)) {
                return res.status(403).json({ 
                    error: `Access denied. Required permission: ${permission}` 
                });
            }

            next();
        } catch (error) {
            res.status(500).json({ error: 'Error checking permissions' });
        }
    };
};

// Utility function for signing tokens
export const signToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

// Utility function for signing admin tokens
export const signAdminToken = (admin) => {
    return signToken({
        id: admin._id,
        type: 'admin',
        username: admin.username,
        email: admin.email
    });
};
