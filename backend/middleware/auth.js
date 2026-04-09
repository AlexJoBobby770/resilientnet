const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 *
 * Extracts the Bearer token from the Authorization header,
 * verifies it, and attaches req.userId for downstream use.
 *
 * Usage:
 *   const authMiddleware = require('../middleware/auth');
 *   router.get('/protected', authMiddleware, (req, res) => { ... });
 */
module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // 1. Check that the header exists and is in "Bearer <token>" format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. Malformed authorization header.' });
    }

    try {
        // 2. Verify the token using our JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Attach userId to the request for use in route handlers
        req.userId = decoded.userId;

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired. Please sign in again.' });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token. Authentication failed.' });
        }
        // Catch-all for any other JWT errors
        return res.status(401).json({ message: 'Token verification failed.' });
    }
};