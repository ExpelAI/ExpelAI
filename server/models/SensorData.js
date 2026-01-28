const mongoose = require('mongoose');

const SensorDataSchema = new mongoose.Schema({
    temperature: {
        type: Number,
        required: true,
    },
    humidity: {
        type: Number,
        required: true,
    },
    soilMoisture: {
        type: Number,
        required: true,
    },
    riskLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('SensorData', SensorDataSchema);
