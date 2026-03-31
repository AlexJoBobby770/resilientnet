const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

/**
 * @route   GET /api/alerts/:householdId
 * @desc    Get all active/unacknowledged alerts for a household
 */
router.get('/:householdId', async (req, res) => {
    try {
        const { householdId } = req.params;

        // Fetch alerts, sorted by newest first
        const alerts = await Alert.find({
            householdId,
            acknowledged: false // Only show what the user hasn't seen yet
        }).sort({ createdAt: -1 });

        res.json(alerts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route   PATCH /api/alerts/:alertId/acknowledge
 * @desc    Mark an alert as read/seen
 */
router.patch('/:alertId/acknowledge', async (req, res) => {
    try {
        const alert = await Alert.findByIdAndUpdate(
            req.params.alertId,
            { acknowledged: true },
            { new: true }
        );
        res.json(alert);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;