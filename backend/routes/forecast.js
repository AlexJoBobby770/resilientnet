const express = require('express');
const router = express.Router();
const axios = require('axios');
const ResourceLog = require('../models/ResourceLog');
const Forecast = require('../models/Forecast');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

/**
 * @route   POST /api/forecast/trigger/:householdId
 * @desc    Fetch logs -> Call AI Service -> Save Forecast
 */
router.post('/trigger/:householdId', async (req, res) => {
    try {
        const { householdId } = req.params;

        // 1. Fetch last 30 days of logs (Sort by date ascending for the AI)
        const logs = await ResourceLog.find({ householdId })
            .sort({ date: 1 })
            .limit(30);

        if (logs.length < 5) {
            return res.status(400).json({
                message: "Not enough data to forecast. Need at least 5 logs."
            });
        }

        // 2. Format data for Prophet (Python AI expects 'ds' and 'y')
        // We'll forecast Electricity as the primary example
        const formattedData = logs.map(log => ({
            ds: log.date.toISOString().split('T')[0], // "2026-03-31"
            y: log.electricity_kwh
        }));

        // 3. Call the Python AI Service
        const aiResponse = await axios.post(`${AI_SERVICE_URL}/forecast`, {
            resource: "electricity",
            data: formattedData,
            periods: 30
        });

        const { predictions } = aiResponse.data;

        // 4. Save the results to our MongoDB Forecasts collection
        const newForecast = new Forecast({
            householdId,
            resource: "electricity",
            predictions: predictions.map(p => ({
                date: p.ds,
                predicted_value: p.yhat,
                lower_bound: p.yhat_lower,
                upper_bound: p.yhat_upper
            }))
        });

        await newForecast.save();

        res.json({
            message: "Forecast generated and saved successfully",
            forecast: newForecast
        });

    } catch (err) {
        console.error("AI SERVICE ERROR:", err.message);
        res.status(500).json({
            error: "Failed to connect to AI Service. Is the Python server running?",
            details: err.message
        });
    }
});

module.exports = router;