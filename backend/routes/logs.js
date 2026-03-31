const express = require('express');
const router = express.Router();
const ResourceLog = require('../models/ResourceLog');

/**
 * @route   POST /api/logs
 * @desc    Submit a daily resource log
 */
router.post('/', async (req, res) => {
    try {
        const {
            householdId,
            date,
            electricity_kwh,
            water_liters,
            lpg_kg_remaining,
            days_since_refill
        } = req.body;

        // Basic validation
        if (!householdId || electricity_kwh === undefined) {
            return res.status(400).json({ message: "Household ID and electricity usage are required" });
        }

        const newLog = new ResourceLog({
            householdId,
            date: date || Date.now(), // Use provided date or default to today
            electricity_kwh,
            water_liters,
            lpg_kg_remaining,
            days_since_refill
        });

        const savedLog = await newLog.save();
        res.status(201).json(savedLog);

    } catch (err) {
        console.error("LOGGING ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route   GET /api/logs/:householdId
 * @desc    Get last 30 logs for a specific household (for the AI Service)
 */
router.get('/:householdId', async (req, res) => {
    try {
        const logs = await ResourceLog.find({ householdId: req.params.householdId })
            .sort({ date: -1 }) // Newest first
            .limit(30);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;