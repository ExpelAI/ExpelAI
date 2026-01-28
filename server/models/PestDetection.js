const mongoose = require('mongoose');

const PestDetectionSchema = new mongoose.Schema({
    pestType: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        default: 0,
    },
    confidence: {
        type: Number,
        min: 0,
        max: 1,
    },
    // PRD: Risk Level
    severity: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low',
    },
    // PRD: Actionable Advice
    recommendation: {
        type: String,
        default: 'Continue monitoring.',
    },
    // PRD: Explainable AI Reasoning
    reasoning: {
        type: String,
        default: 'Visual analysis complete.',
    },
    imageUrl: {
        type: String,
    }
}, {
    timestamps: true, // Automatically creates createdAt and updatedAt
});

module.exports = mongoose.models.PestDetection || mongoose.model('PestDetection', PestDetectionSchema);