const mongoose = require('mongoose');

const ForecastSchema = new mongoose.Schema({
    householdId: { type: mongoose.Schema.Types.ObjectId, ref: 'Household', required: true },
    generatedAt: { type: Date, default: Date.now },
    resource: { type: String, enum: ['electricity', 'water', 'lpg'], required: true },
    predictions: [{
        date: Date,
        predicted_value: Number,
        lower_bound: Number,
        upper_bound: Number
    }]
});

router.get('/resilience/:householdId', async (req, res) => {
    try {
        const log = await ResourceLog.findOne({ householdId: req.params.householdId })
            .sort({ date: -1 });
        if (!log) return res.json({ overall: 0, energy: 0, water: 0, lpg: 0, status: 'critical' });
        const r = await axios.post(`${AI_SERVICE_URL}/resilience-score`, {
            electricity_kwh: log.electricity_kwh,
            water_liters: log.water_liters,
            lpg_days_remaining: log.lpg_kg_remaining / 0.3
        });
        res.json(r.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = mongoose.model('Forecast', ForecastSchema);