const mongoose = require('mongoose');

const ResourceLogSchema = new mongoose.Schema({
    householdId: { type: mongoose.Schema.Types.ObjectId, ref: 'Household', required: true },
    date: { type: Date, required: true },
    electricity_kwh: { type: Number, required: true },
    water_liters: { type: Number, required: true },
    lpg_kg_remaining: { type: Number, required: true },
    days_since_refill: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ResourceLog', ResourceLogSchema);