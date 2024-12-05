const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const initDBConnection = require("./config/db");

const knowledgeHubRoutes = require("./routes/knowledgeHubRoutes");
const careerRoutes = require("./routes/careerRoutes");
const authRouter = require("./routes/auth");

const bodyParser = require("body-parser");
const app = express();
dotenv.config({ path: "./config/.env" });
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

initDBConnection();

class SpecializationRecommender {
  constructor() {
    // Define specializations
    this.specializations = [
      "Artificial Intelligence",
      "Information Systems",
      "Computer Science",
      "Computer Networking",
      "Software Engineering",
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
      M10: [0.2, 0.4, 1, 0.4, 0.5],
    };

    // Define MCQ choices correlations with specializations

    // AI, IS, CS, CN, SE  (the order of the weights)
    this.mcqCorrelations = {
      Q1: [
        [1, 0.6, 0.8, 0.5, 0.7], // Choice A correlations: AI: 1, IS: 0.6, CS: 0.8, CN: 0.5, SE: 0.7
        [0.7, 0.5, 0.6, 0.4, 0.5], // Choice B correlations: AI: 0.7, IS: 0.5, CS: 0.6, CN: 0.4, SE: 0.5
        [0.4, 0.3, 0.5, 0.3, 0.4], // Choice C correlations: AI: 0.4, IS: 0.3, CS: 0.5, CN: 0.3, SE: 0.4
        [0.1, 0.2, 0.3, 0.1, 0.3], // Choice D correlations: AI: 0.1, IS: 0.2, CS: 0.3, CN: 0.1, SE: 0.3
      ],
      Q2: [
        [0.8, 0.5, 0.8, 0.6, 1], // Choice A correlations: AI: 0.8, IS: 0.5, CS: 0.8, CN: 0.6, SE: 1
        [0.6, 0.6, 0.7, 0.5, 0.8], // Choice B correlations: AI: 0.6, IS: 0.6, CS: 0.7, CN: 0.5, SE: 0.8
        [0.4, 0.7, 0.6, 0.4, 0.5], // Choice C correlations: AI: 0.4, IS: 0.7, CS: 0.6, CN: 0.4, SE: 0.5
        [0.3, 0.5, 0.4, 0.3, 0.3], // Choice D correlations: AI: 0.3, IS: 0.5, CS: 0.4, CN: 0.3, SE: 0.3
      ],
      Q3: [
        [0.6, 0.5, 0.7, 1, 0.8], // Choice A correlations: AI: 0.6, IS: 0.5, CS: 0.7, CN: 1, SE: 0.8
        [0.5, 0.6, 0.6, 0.7, 0.6], // Choice B correlations: AI: 0.5, IS: 0.6, CS: 0.6, CN: 0.7, SE: 0.6
        [0.3, 0.5, 0.5, 0.4, 0.4], // Choice C correlations: AI: 0.3, IS: 0.5, CS: 0.5, CN: 0.4, SE: 0.4
        [0.1, 0.3, 0.3, 0.2, 0.3], // Choice D correlations: AI: 0.1, IS: 0.3, CS: 0.3, CN: 0.2, SE: 0.3
      ],
      Q4: [
        [0.8, 1, 0.7, 0.5, 0.7], // Choice A correlations: AI: 0.8, IS: 1, CS: 0.7, CN: 0.5, SE: 0.7
        [0.6, 0.8, 0.6, 0.6, 0.6], // Choice B correlations: AI: 0.6, IS: 0.8, CS: 0.6, CN: 0.6, SE: 0.6
        [0.4, 0.5, 0.5, 0.4, 0.5], // Choice C correlations: AI: 0.4, IS: 0.5, CS: 0.5, CN: 0.4, SE: 0.5
        [0.2, 0.4, 0.4, 0.3, 0.3], // Choice D correlations: AI: 0.2, IS: 0.4, CS: 0.4, CN: 0.3, SE: 0.3
      ],
      Q5: [
        [0.7, 0.6, 0.8, 0.4, 0.7], // Choice A correlations: AI: 0.7, IS: 0.6, CS: 0.8, CN: 0.4, SE: 0.7
        [0.5, 0.8, 0.7, 0.5, 0.6], // Choice B correlations: AI: 0.5, IS: 0.8, CS: 0.7, CN: 0.5, SE: 0.6
        [0.4, 0.7, 0.6, 0.4, 0.5], // Choice C correlations: AI: 0.4, IS: 0.7, CS: 0.6, CN: 0.4, SE: 0.5
        [0.3, 0.5, 0.4, 0.3, 0.4], // Choice D correlations: AI: 0.3, IS: 0.5, CS: 0.4, CN: 0.3, SE: 0.4
      ],
    };

    // Add default correlations for Q6 to Q15
    for (let i = 6; i <= 15; i++) {
      this.mcqCorrelations[`Q${i}`] = [
        [0.2, 0.2, 0.2, 0.2, 0.2],
        [0.2, 0.2, 0.2, 0.2, 0.2],
        [0.2, 0.2, 0.2, 0.2, 0.2],
        [0.2, 0.2, 0.2, 0.2, 0.2],
      ];
    }
  }

  calculateModuleScores(grades) {
    const scores = new Array(this.specializations.length).fill(0);

    if (Object.keys(grades).length === 0) {
      console.warn("No grades provided. Module scores will be 0.");
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
      if (
        this.mcqCorrelations[question] &&
        this.mcqCorrelations[question][choiceIndex]
      ) {
        const correlations = this.mcqCorrelations[question][choiceIndex];
        correlations.forEach((correlation, index) => {
          scores[index] += correlation;
        });
      } else {
        console.warn(
          `Unexpected MCQ response: Question ${question}, Choice ${choiceIndex}`
        );
      }
    });

    return scores;
  }
  normalizeScores(scores) {
    const total = scores.reduce((sum, score) => sum + score, 0);
    return total === 0 ? scores : scores.map((score) => score / total);
  }

  gradeToNumeric(grade) {
    const gradeMap = {
      "A+": 95,
      A: 90,
      "A-": 85,
      "B+": 80,
      B: 75,
      "B-": 70,
      "C+": 65,
      C: 60,
      "C-": 55,
      "D+": 50,
      D: 45,
      "D-": 40,
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
    const finalScores = normalizedModuleScores.map(
      (moduleScore, index) =>
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
      scores: scoresObject,
    };
  }
}

const recommender = new SpecializationRecommender();

app.post("/recommend-specialization", (req, res) => {
  const { grades, mcqResponses } = req.body;

  // Validate input
  if (!grades || !mcqResponses) {
    return res.status(400).json({ error: "Missing grades or MCQ responses" });
  }

  console.log("Received grades:", grades);
  console.log("Received MCQ responses:", mcqResponses);

  // Generate recommendation
  const result = recommender.recommendSpecialization(grades, mcqResponses);

  console.log("Calculated result:", result);

  res.json(result);
});

// SAMEHHHH ---------------------------------------------------------------------------------

app.use("/", careerRoutes);
app.use("/", authRouter);

//--------------------------nader----------------------------------
app.use("/", knowledgeHubRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
