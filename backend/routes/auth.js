const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * @route   POST /api/auth/google
 * @desc    Verify Google credential token, find/create user, return JWT
 * @access  Public
 */
router.post('/google', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'Google credential token is required.' });
    }

    try {
        // 1. Verify the Google ID token with Google's servers
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            return res.status(401).json({ message: 'Invalid Google token: empty payload.' });
        }

        const { sub: googleId, name, email } = payload;

        if (!googleId || !email) {
            return res.status(401).json({ message: 'Invalid Google token: missing required fields.' });
        }

        // 2. Find or create the user in MongoDB
        let user = await User.findOne({ googleId });

        if (!user) {
            user = await User.create({ googleId, name, email });
            console.log(`✅ New user created: ${email}`);
        } else {
            console.log(`🔁 Existing user logged in: ${email}`);
        }

        // 3. Sign and return a JWT (valid for 7 days)
        const jwtToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            token: jwtToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (err) {
        console.error('❌ Auth error:', err.message);

        // Distinguish between Google verification failures and server errors
        if (err.message && err.message.includes('Token used too late')) {
            return res.status(401).json({ message: 'Google token has expired. Please sign in again.' });
        }
        if (err.message && (err.message.includes('Invalid token') || err.message.includes('Wrong number'))) {
            return res.status(401).json({ message: 'Invalid Google token. Authentication failed.' });
        }

        res.status(500).json({ message: 'Server error during authentication.' });
    }
});

module.exports = router;