const express = require('express');
const router = express.Router();
const axios = require('axios');
const ResourceLog = require('../models/ResourceLog');
const Forecast = require('../models/Forecast');
const Alert = require('../models/Alert');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

/**
 * @route   POST /api/forecast/trigger/:householdId
 * @desc    Fetch logs -> Call AI Service -> Save Forecast -> Generate Alerts
 */
router.post('/trigger/:householdId', async (req, res) => {
    try {
        const { householdId } = req.params;

        // 1. Fetch 30 newest logs (Ordered Newest -> Oldest)
        const recentLogs = await ResourceLog.find({ householdId })
            .sort({ date: -1 })
            .limit(30);

        if (recentLogs.length < 5) {
            return res.status(400).json({
                message: "Not enough data to forecast. Need at least 5 logs."
            });
        }

        // 2. Prepare chronological data for Prophet (Oldest -> Newest)
        const chronologicalLogs = [...recentLogs].reverse();
        const latestLog = chronologicalLogs[chronologicalLogs.length - 1];

        // 3. Format data for Prophet
        const formattedData = chronologicalLogs.map(log => ({
            ds: log.date.toISOString().split('T')[0],
            y: log.electricity_kwh
        }));

        // 4. Call AI Service for Forecast
        const aiResponse = await axios.post(`${AI_SERVICE_URL}/forecast`, {
            resource: "electricity",
            data: formattedData,
            periods: 30
        });

        const { predictions } = aiResponse.data;

        // 5. Save the Forecast results
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

        // 6. Get Resilience Score based on THE LATEST LOG
        const scoreResponse = await axios.post(`${AI_SERVICE_URL}/resilience-score`, {
            electricity_kwh: latestLog.electricity_kwh,
            water_liters: latestLog.water_liters,
            lpg_days_remaining: latestLog.lpg_kg_remaining / 0.3 // Estimated days
        });

        const scoreData = scoreResponse.data;

        // 7. If status is NOT 'stable', get LLM recommendations and save Alert
        if (scoreData.status !== 'stable') {
            const recommendResponse = await axios.post(`${AI_SERVICE_URL}/recommend`, {
                household_id: householdId,
                energy_score: scoreData.energy,
                water_score: scoreData.water,
                lpg_score: scoreData.lpg,
                resilience_score: scoreData.overall,
                stress_level: scoreData.status
            });

            const newAlert = new Alert({
                householdId,
                resource: "overall",
                severity: scoreData.status,
                resilience_score: scoreData.overall,
                recommendations: recommendResponse.data.recommendations
            });

            await newAlert.save();
        }

        res.json({
            message: "Forecast and Resilience check completed successfully",
            forecast: newForecast,
            resilience: scoreData
        });

    } catch (err) {
        console.error("AI SERVICE ERROR:", err.message);
        res.status(500).json({
            error: "Logic execution failed",
            details: err.message,
            hint: "Is the FastAPI service running on port 8000?"
        });
    }
});

module.exports = router;