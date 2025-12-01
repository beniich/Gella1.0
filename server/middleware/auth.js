import { findUserById } from '../db.js';

// Middleware to require authentication
export const requireAuth = async (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const user = findUserById(req.session.userId);
        if (!user) {
            req.session.destroy();
            return res.status(401).json({ error: 'User not found' });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Authentication error' });
    }
};

// Optional: Middleware to check if user has enough credits
export const requireCredits = (minCredits = 1) => {
    return (req, res, next) => {
        if (req.user.credits < minCredits) {
            return res.status(403).json({
                error: 'Insufficient credits',
                credits: req.user.credits,
                required: minCredits
            });
        }
        next();
    };
};
