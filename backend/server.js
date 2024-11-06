const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

class SpecializationRecommender {
    constructor() {
        // Define specializations
        this.specializations = [
            'Artificial Intelligence',
            'Information Systems',
            'Computer Science',
            'Computer Networking',
            'Software Engineering'
        ];
        
        // Define module correlations with specializations
        this.moduleCorrelations = {
            'M1': [0.8, 0.4, 0.6, 0.3, 0.5],  // AI, IS, CS, CN, SE
            'M2': [0.6, 0.7, 0.5, 0.4, 0.6],
            'M3': [0.4, 0.6, 0.7, 0.5, 0.8],
            'M4': [0.7, 0.5, 0.6, 0.8, 0.4],
            'M5': [0.5, 0.8, 0.4, 0.6, 0.7],
            'M6': [0.9, 0.3, 0.5, 0.4, 0.6],
            'M7': [0.4, 0.7, 0.8, 0.5, 0.6],
            'M8': [0.6, 0.5, 0.7, 0.9, 0.4],
            'M9': [0.5, 0.6, 0.4, 0.7, 0.9],
            'M10': [0.7, 0.5, 0.6, 0.4, 0.8]
        };
        
        // Define MCQ choices correlations with specializations
        this.mcqCorrelations = {
            'Q1': [
                [0.8, 0.3, 0.4, 0.2, 0.5],  // Choice A correlations
                [0.3, 0.7, 0.4, 0.5, 0.3],  // Choice B correlations
                [0.4, 0.3, 0.8, 0.4, 0.5],  // Choice C correlations
                [0.2, 0.4, 0.3, 0.7, 0.6]   // Choice D correlations
            ],
            'Q2': [
                [0.7, 0.4, 0.5, 0.3, 0.4],
                [0.4, 0.8, 0.3, 0.4, 0.5],
                [0.3, 0.4, 0.7, 0.5, 0.4],
                [0.4, 0.3, 0.4, 0.8, 0.5]
            ],
            'Q3': [
                [0.6, 0.5, 0.4, 0.4, 0.7],
                [0.5, 0.7, 0.4, 0.3, 0.4],
                [0.4, 0.4, 0.8, 0.5, 0.3],
                [0.3, 0.4, 0.5, 0.7, 0.6]
            ],
            'Q4': [
                [0.8, 0.4, 0.3, 0.5, 0.4],
                [0.4, 0.7, 0.5, 0.4, 0.3],
                [0.3, 0.5, 0.8, 0.4, 0.5],
                [0.5, 0.4, 0.4, 0.7, 0.8]
            ],
            'Q5': [
                [0.7, 0.5, 0.4, 0.3, 0.6],
                [0.5, 0.8, 0.3, 0.4, 0.4],
                [0.4, 0.3, 0.7, 0.5, 0.5],
                [0.3, 0.4, 0.5, 0.8, 0.7]
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
      const scores = new Array(this.specializations.length).fill(0);
      
      if (Object.keys(grades).length === 0) {
          console.warn('No grades provided. Module scores will be 0.');
          return scores;
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
  }
  calculateMcqScores(mcqResponses) {
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
}
  normalizeScores(scores) {
    const total = scores.reduce((sum, score) => sum + score, 0);
    return total === 0 ? scores : scores.map(score => score / total);
  }

    gradeToNumeric(grade) {
        const gradeMap = {
            'A+': 95, 'A': 90, 'A-': 85,
            'B+': 80, 'B': 75, 'B-': 70,
            'C+': 65, 'C': 60, 'C-': 55,
            'D+': 50, 'D': 45, 'D-': 40
        };
        return gradeMap[grade] || 0;
    }

    recommendSpecialization(grades, mcqResponses, moduleWeight = 0.7) {
      // Calculate scores from modules and MCQs
      const moduleScores = this.calculateModuleScores(grades);
      const mcqScores = this.calculateMcqScores(mcqResponses);
      
      // Normalize individual scores
      const normalizedModuleScores = this.normalizeScores(moduleScores);
      const normalizedMcqScores = this.normalizeScores(mcqScores);
      
      // Combine scores with weights
      const mcqWeight = 1 - moduleWeight;
      const finalScores = normalizedModuleScores.map((moduleScore, index) => 
          moduleScore * moduleWeight + normalizedMcqScores[index] * mcqWeight
      );
      
      // Find the specialization with highest score
      const maxScore = Math.max(...finalScores);
      const maxIndex = finalScores.indexOf(maxScore);
      
      // Create scores object
      const scoresObject = {};
      this.specializations.forEach((spec, index) => {
          scoresObject[spec] = finalScores[index];
      });
      
      return {
          recommendation: this.specializations[maxIndex],
          scores: scoresObject
      };
  }
}

const recommender = new SpecializationRecommender();

app.post('/recommend-specialization', (req, res) => {
  const { grades, mcqResponses } = req.body;
  
  // Validate input
  if (!grades || !mcqResponses) {
      return res.status(400).json({ error: 'Missing grades or MCQ responses' });
  }

  console.log('Received grades:', grades);
  console.log('Received MCQ responses:', mcqResponses);

  // Generate recommendation
  const result = recommender.recommendSpecialization(grades, mcqResponses);

  console.log('Calculated result:', result);

  res.json(result);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});