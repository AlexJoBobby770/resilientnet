const express = require('express');
const router = express.Router();
const Household = require('../models/Household');

// POST: Create a new household
router.post('/', async (req, res) => {
    try {
        const { name, location } = req.body;

        if (!name || !location) {
            return res.status(400).json({ message: "Name and location are required" });
        }

        // Hardcoded valid MongoDB ID for testing until Auth is ready
        const mockUserId = "65f1a2b3c4d5e6f7a8b9c0d1";

        const newHousehold = new Household({
            userId: mockUserId,
            name,
            location
        });

        const savedHousehold = await newHousehold.save();
        res.status(201).json(savedHousehold);

    } catch (err) {
        // 👇 THIS LINE WILL TELL YOU THE TRUTH IN THE TERMINAL
        console.error("DETAILED ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

// GET: Fetch households (Replacing the "working" message with real data)
router.get('/', async (req, res) => {
    try {
        const mockUserId = "65f1a2b3c4d5e6f7a8b9c0d1";
        const households = await Household.find({ userId: mockUserId });
        res.json(households);
    } catch (err) {
        console.error("GET ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;