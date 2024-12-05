// controllers/recommendationController.js

const RecommendationService = require('../services/recommendationService');

const getRecommendation = async (req, res) => {
    try {
        const { grades, mcqResponses } = req.body;

        // Validate input
        if (!grades || !mcqResponses) {
            return res.status(400).json({ error: "Missing grades or MCQ responses" });
        }

        console.log("Received grades:", grades);
        console.log("Received MCQ responses:", mcqResponses);

        // Generate recommendation
        const recommendationService = new RecommendationService();
        const result = recommendationService.recommendSpecialization(grades, mcqResponses);

        console.log("Calculated result:", result);

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getRecommendation
};