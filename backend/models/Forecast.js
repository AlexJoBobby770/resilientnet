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

module.exports = mongoose.model('Forecast', ForecastSchema);