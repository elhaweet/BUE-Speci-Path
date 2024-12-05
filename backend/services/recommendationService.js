//  services/recommendationService.js

const SpecializationModel = require('../models/Specialization');

class RecommendationService {
    constructor() {
        // Define specializations
        this.specializations = [
            "Artificial Intelligence",
            "Information Systems",
            "Computer Science",
            "Computer Networking",
            "Software Engineering"
        ];

        // Define module correlations with specializations
        this.moduleCorrelations = {
            M1: [0.3, 1, 0.1, 0.2, 0.5], // AI, IS, CS, CN, SE
            M2: [0.5, 0.7, 0.9, 0.4, 0.7],
            M3: [0.8, 0.5, 0.5, 0.5, 0.5],
            M4: [0.8, 0.5, 0.5, 0.5, 0.5],
            M5: [0.2, 0.5, 0.4, 0.7, 1],
            M6: [0.4, 0.4, 0.5, 0.6, 1],
            M7: [0.3, 0.5, 0.4, 0.5, 9],
            M8: [0.9, 0.5, 0.5, 0.3, 0.3],
            M9: [0.2, 0.2, 0.3, 1, 0.6],
            M10: [0.2, 0.4, 1, 0.4, 0.5]
        };

        // Define MCQ choices correlations with specializations
        this.mcqCorrelations = {
            Q1: [
                [1, 0.6, 0.8, 0.5, 0.7],    // Choice A correlations
                [0.7, 0.5, 0.6, 0.4, 0.5],   // Choice B correlations
                [0.4, 0.3, 0.5, 0.3, 0.4],   // Choice C correlations
                [0.1, 0.2, 0.3, 0.1, 0.3]    // Choice D correlations
            ],
            Q2: [
                [0.8, 0.5, 0.8, 0.6, 1],
                [0.6, 0.6, 0.7, 0.5, 0.8],
                [0.4, 0.7, 0.6, 0.4, 0.5],
                [0.3, 0.5, 0.4, 0.3, 0.3]
            ],
            Q3: [
                [0.6, 0.5, 0.7, 1, 0.8],
                [0.5, 0.6, 0.6, 0.7, 0.6],
                [0.3, 0.5, 0.5, 0.4, 0.4],
                [0.1, 0.3, 0.3, 0.2, 0.3]
            ],
            Q4: [
                [0.8, 1, 0.7, 0.5, 0.7],
                [0.6, 0.8, 0.6, 0.6, 0.6],
                [0.4, 0.5, 0.5, 0.4, 0.5],
                [0.2, 0.4, 0.4, 0.3, 0.3]
            ],
            Q5: [
                [0.7, 0.6, 0.8, 0.4, 0.7],
                [0.5, 0.8, 0.7, 0.5, 0.6],
                [0.4, 0.7, 0.6, 0.4, 0.5],
                [0.3, 0.5, 0.4, 0.3, 0.4]
            ]
        };

        // Add default correlations for Q6 to Q15
        for (let i = 6; i <= 15; i++) {
            this.mcqCorrelations[`Q${i}`] = [
                [0.2, 0.2, 0.2, 0.2, 0.2],
                [0.2, 0.2, 0.2, 0.2, 0.2],
                [0.2, 0.2, 0.2, 0.2, 0.2],
                [0.2, 0.2, 0.2, 0.2, 0.2]
            ];
        }
    }

    calculateModuleScores(grades) {
        try {
            const scores = new Array(this.specializations.length).fill(0);

            if (Object.keys(grades).length === 0) {
                throw new Error("No grades provided");
            }

            Object.entries(grades).forEach(([module, grade]) => {
                if (this.moduleCorrelations[module]) {
                    const correlations = this.moduleCorrelations[module];
                    correlations.forEach((correlation, index) => {
                        scores[index] += this.gradeToNumeric(grade) * correlation;
                    });
                } else {
                    console.warn(`Unknown module: ${module}`);
                }
            });

            return scores;
        } catch (error) {
            throw new Error(`Error calculating module scores: ${error.message}`);
        }
    }

    calculateMcqScores(mcqResponses) {
        try {
            const scores = new Array(this.specializations.length).fill(0);

            Object.entries(mcqResponses).forEach(([question, choiceIndex]) => {
                if (this.mcqCorrelations[question] && this.mcqCorrelations[question][choiceIndex]) {
                    const correlations = this.mcqCorrelations[question][choiceIndex];
                    correlations.forEach((correlation, index) => {
                        scores[index] += correlation;
                    });
                } else {
                    console.warn(`Unexpected MCQ response: Question ${question}, Choice ${choiceIndex}`);
                }
            });

            return scores;
        } catch (error) {
            throw new Error(`Error calculating MCQ scores: ${error.message}`);
        }
    }

    normalizeScores(scores) {
        try {
            const total = scores.reduce((sum, score) => sum + score, 0);
            return total === 0 ? scores : scores.map(score => (score / total).toFixed(4));
        } catch (error) {
            throw new Error(`Error normalizing scores: ${error.message}`);
        }
    }

    gradeToNumeric(grade) {
        const gradeMap = {
            'A+': 80,
            'A': 75,
            'A-': 70,
            'B+': 69,
            'B': 65,
            'B-': 60,
            'C+': 59,
            'C': 55,
            'C-': 52,
            'D+': 49,
            'D': 45,
            'D-': 40
        };

        const numericGrade = gradeMap[grade];
        if (numericGrade === undefined) {
            throw new Error(`Invalid grade: ${grade}`);
        }
        return numericGrade;
    }

    recommendSpecialization(grades, mcqResponses, moduleWeight = 0.7) {
        try {
            // Validate inputs
            if (!grades || !mcqResponses) {
                throw new Error("Both grades and MCQ responses are required");
            }
    
            // Validate that we have enough data
            if (Object.keys(grades).length === 0 || Object.keys(mcqResponses).length === 0) {
                throw new Error("Grades and MCQ responses cannot be empty");
            }
    
            // Calculate scores from modules and MCQs
            const moduleScores = this.calculateModuleScores(grades);
            const mcqScores = this.calculateMcqScores(mcqResponses);
    
            // Normalize individual scores
            const normalizedModuleScores = this.normalizeScores(moduleScores);
            const normalizedMcqScores = this.normalizeScores(mcqScores);
    
            // Combine scores with weights
            const mcqWeight = 1 - moduleWeight;
            const finalScores = normalizedModuleScores.map((moduleScore, index) => 
                (moduleScore * moduleWeight + normalizedMcqScores[index] * mcqWeight).toFixed(4)
            );
    
            // Convert final scores to numbers for comparison
            const finalScoresNumeric = finalScores.map(Number);
    
            // Find the specialization with highest score
            const maxScore = Math.max(...finalScoresNumeric);
            const maxIndex = finalScoresNumeric.indexOf(maxScore);
    
            // Create scores object
            const scoresObject = {};
            this.specializations.forEach((spec, index) => {
                scoresObject[spec] = parseFloat(finalScores[index]);
            });
    
            // Determine recommendation with confidence threshold
            const confidenceThreshold = 0.1; // 30% confidence
            const recommendation = maxScore >= confidenceThreshold 
                ? this.specializations[maxIndex] 
                : "Unable to determine a clear recommendation";
    
            return {
                recommendation: recommendation,
                scores: scoresObject,
                confidence: parseFloat(maxScore)
            };
        } catch (error) {
            console.error("Recommendation Error:", error);
            return {
                recommendation: "Error in recommendation process",
                scores: {},
                confidence: 0
            };
        }
    }
}
    
module.exports = RecommendationService;