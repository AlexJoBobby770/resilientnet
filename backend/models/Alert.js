const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
    householdId: { type: mongoose.Schema.Types.ObjectId, ref: 'Household', required: true },
    createdAt: { type: Date, default: Date.now },
    resource: String,
    severity: { type: String, enum: ['warning', 'critical'] },
    resilience_score: Number,
    recommendations: [String],
    acknowledged: { type: Boolean, default: false }
});

module.exports = mongoose.model('Alert', AlertSchema);