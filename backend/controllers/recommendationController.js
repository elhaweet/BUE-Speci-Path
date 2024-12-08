// controllers/recommendationController.js

const RecommendationService = require('../services/recommendationService');
const RecommendationResult = require('../models/RecommendationResult');

const getRecommendation = async (req, res) => {
    try {
        const { grades, mcqResponses } = req.body;

        if (!grades || !mcqResponses) {
            return res.status(400).json({ error: "Missing grades or MCQ responses" });
        }

        console.log("Received grades:", grades);
        console.log("Received MCQ responses:", mcqResponses);

        // Generate recommendation
        const recommendationService = new RecommendationService();
        const result = recommendationService.recommendSpecialization(grades, mcqResponses);

        console.log("Calculated result:", result);

        const recommendationResult = new RecommendationResult({
            grades: grades,                        // Store received grades
            mcqResponses: mcqResponses,            // Store received MCQ responses
            recommendation: result.recommendation,  // Store the recommended specialization
            scores: result.scores,                  // Store the scores for each specialization
            confidence: result.confidence          // Store the confidence score
        });

        // Save the result to the database
        await recommendationResult.save();

        // Send the result in the response
        res.json(result);
    } catch (error) {
        console.error("Error in recommendation process:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getRecommendation
};
