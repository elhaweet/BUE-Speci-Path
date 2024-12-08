// models/RecommendationResult.js

const mongoose = require('mongoose');

const recommendationResultSchema = new mongoose.Schema({
    grades: {
        type: Map,
        of: String,
        required: true
    },
    mcqResponses: {
        type: Map,
        of: Number,
        required: true
    },
    recommendation: {
        type: String,
        required: true
    },
    scores: {
        type: Map,
        of: Number,
        required: true
    },
    confidence: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('RecommendationResult', recommendationResultSchema);
