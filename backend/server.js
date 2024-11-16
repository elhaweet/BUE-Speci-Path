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



// SAMEHHHH ---------------------------------------------------------------------------------
const careerData = [
  {
    specialization: 'AI (Artificial Intelligence)',
    careers: [
      {
        name: 'Machine Learning Engineer',
        description: 'Designs and implements machine learning models and algorithms.',
        requiredSkills: ['Python', 'TensorFlow', 'Data Analysis'],
        resources: ['Coursera: Machine Learning by Andrew Ng', 'Udacity: Deep Learning Nanodegree']
      },
      {
        name: 'AI Research Scientist',
        description: 'Conducts research to develop new AI algorithms and technologies.',
        requiredSkills: ['Mathematics', 'Research Skills', 'Programming'],
        resources: ['edX: AI for Everyone', 'Kaggle: Advanced ML Techniques']
      },
      {
        name: 'Robotics Engineer',
        description: 'Develops robots and robotic systems to enhance automation.',
        requiredSkills: ['C++', 'Robotics Frameworks', 'Mechanical Engineering'],
        resources: ['Robotics Certification by MIT', 'Robotics Specialization on Coursera']
      },
      {
        name: 'Natural Language Processing (NLP) Engineer',
        description: 'Works on building systems that understand and generate human language.',
        requiredSkills: ['Linguistics', 'Python', 'NLP Libraries (spaCy, NLTK)'],
        resources: ['Stanford NLP Course', 'Hugging Face Tutorials']
      }
    ]
  },
  {
    specialization: 'SE (Software Engineering)',
    careers: [
      {
        name: 'Software Developer',
        description: 'Develops software solutions by studying information needs and systems flow.',
        requiredSkills: ['JavaScript', 'Problem Solving', 'Version Control'],
        resources: ['Udemy: The Complete Web Developer Course', 'Pluralsight: Software Design Patterns']
      },
      {
        name: 'DevOps Engineer',
        description: 'Works on automating and streamlining software development processes.',
        requiredSkills: ['CI/CD Tools', 'Cloud Platforms', 'Scripting'],
        resources: ['LinkedIn Learning: DevOps Foundations', 'AWS Training: DevOps on AWS']
      },
      {
        name: 'Full Stack Developer',
        description: 'Handles both client-side and server-side development of applications.',
        requiredSkills: ['HTML/CSS', 'Node.js', 'React/Vue/Angular'],
        resources: ['Full Stack Web Developer Bootcamp', 'Frontend Masters']
      },
      {
        name: 'Backend Engineer',
        description: 'Focuses on server-side logic, database interaction, and APIs.',
        requiredSkills: ['Node.js', 'Databases', 'RESTful APIs'],
        resources: ['Backend Development on Pluralsight', 'Coursera: Backend with Node.js']
      }
    ]
  },
  {
    specialization: 'IS (Information Systems)',
    careers: [
      {
        name: 'IT Consultant',
        description: 'Analyzes and evaluates IT systems to meet business needs.',
        requiredSkills: ['Business Analysis', 'Technical Writing', 'Communication'],
        resources: ['Coursera: IT Fundamentals', 'edX: IT Management']
      },
      {
        name: 'Systems Analyst',
        description: 'Designs and implements IT solutions that improve business efficiency.',
        requiredSkills: ['Systems Analysis', 'Project Management', 'Database Management'],
        resources: ['Udemy: Systems Analysis & Design', 'Pluralsight: Database Fundamentals']
      },
      {
        name: 'Business Intelligence (BI) Analyst',
        description: 'Uses data analysis tools to support decision-making within an organization.',
        requiredSkills: ['Data Analytics', 'SQL', 'Dashboarding Tools'],
        resources: ['Data Visualization with Tableau', 'Power BI Course by Microsoft']
      },
      {
        name: 'Database Administrator',
        description: 'Manages and maintains database systems for optimal performance.',
        requiredSkills: ['SQL', 'Database Design', 'Backup and Recovery'],
        resources: ['Database Management on Udemy', 'Oracle DB Training']
      }
    ]
  },
  {
    specialization: 'CN (Computer Networks)',
    careers: [
      {
        name: 'Network Administrator',
        description: 'Manages and maintains computer networks and related computing environments.',
        requiredSkills: ['Networking Protocols', 'Firewall Management', 'Troubleshooting'],
        resources: ['Cisco: CCNA Certification', 'CompTIA Network+ Training']
      },
      {
        name: 'Network Security Specialist',
        description: 'Ensures the security and integrity of an organization’s network.',
        requiredSkills: ['Cybersecurity', 'Encryption Methods', 'Incident Response'],
        resources: ['Cybersecurity Fundamentals by IBM', 'SANS Cyber Aces']
      },
      {
        name: 'Cloud Network Engineer',
        description: 'Designs and manages cloud-based network solutions for scalable infrastructure.',
        requiredSkills: ['Cloud Networking', 'AWS/Azure/GCP', 'Automation'],
        resources: ['Cloud Networking on AWS', 'Azure Network Engineer Training']
      },
      {
        name: 'VoIP Engineer',
        description: 'Specializes in the installation and maintenance of VoIP systems.',
        requiredSkills: ['SIP Protocols', 'Network Configuration', 'Unified Communications'],
        resources: ['VoIP Training by Cisco', 'Asterisk VOIP Certification']
      }
    ]
  },
  {
    specialization: 'CS (Computer Science)',
    careers: [
      {
        name: 'Software Engineer',
        description: 'Develops, tests, and maintains software applications.',
        requiredSkills: ['Programming', 'Problem Solving', 'Version Control'],
        resources: ['Udemy: Complete Python Course', 'Coursera: Data Structures and Algorithms']
      },
      {
        name: 'Data Scientist',
        description: 'Analyzes and interprets complex data to help make informed decisions.',
        requiredSkills: ['Statistics', 'Machine Learning', 'Data Visualization'],
        resources: ['DataCamp: Data Science Bootcamp', 'Kaggle: Intro to Machine Learning']
      },
      {
        name: 'Cybersecurity Analyst',
        description: 'Monitors and protects computer systems and networks from security breaches.',
        requiredSkills: ['Threat Detection', 'Penetration Testing', 'SIEM Tools'],
        resources: ['CompTIA Security+', 'CISSP Training by ISC2']
      },
      {
        name: 'Game Developer',
        description: 'Creates and develops video games for various platforms.',
        requiredSkills: ['C#', 'Unity/Unreal Engine', 'Game Design'],
        resources: ['Game Development on Udemy', 'Unity Learn Platform']
      }
    ]
  },
  {
    specialization: 'Web Development',
    careers: [
      {
        name: 'Frontend Developer',
        description: 'Builds the client-side of web applications using modern frameworks.',
        requiredSkills: ['HTML/CSS', 'JavaScript', 'React/Vue/Angular'],
        resources: ['Modern React with Redux', 'Frontend Development Bootcamp']
      },
      {
        name: 'Backend Developer',
        description: 'Develops server-side logic and database management for web applications.',
        requiredSkills: ['Node.js/Java', 'SQL/NoSQL', 'RESTful APIs'],
        resources: ['Backend Development with Node.js', 'Django for Beginners']
      },
      {
        name: 'Full Stack Developer',
        description: 'Manages both the front and back end of web applications.',
        requiredSkills: ['HTML/CSS/JavaScript', 'Backend Frameworks', 'APIs'],
        resources: ['Full Stack Web Developer Course', 'Codecademy: Full-Stack Engineer Path']
      },
      {
        name: 'Web Designer',
        description: 'Designs visually appealing and user-friendly web interfaces.',
        requiredSkills: ['UI/UX Design', 'HTML/CSS', 'Graphic Design Tools'],
        resources: ['Web Design Essentials by Coursera', 'Adobe XD Training']
      }
    ]
  }
];
  
  // Endpoint: ExploreCareerOptions()
  app.get('/explore-career-options', (req, res) => {
    const { specialization } = req.query;
    const result = careerData.find(item => item.specialization === specialization);
    if (result) {
      res.json(result.careers);
    } else {
      res.status(404).json({ message: 'Specialization not found' });
    }
  });
  
  // Endpoint: GetCareerDescriptions()
  app.get('/career-descriptions', (req, res) => {
    const { specialization, career } = req.query;
    const specializationData = careerData.find(item => item.specialization === specialization);
    if (specializationData) {
      const careerDetail = specializationData.careers.find(c => c.name === career);
      if (careerDetail) {
        res.json({ description: careerDetail.description });
      } else {
        res.status(404).json({ message: 'Career not found' });
      }
    } else {
      res.status(404).json({ message: 'Specialization not found' });
    }
  });
  
  // Endpoint: ListRequiredSkills()
  app.get('/required-skills', (req, res) => {
    const { specialization, career } = req.query;
    const specializationData = careerData.find(item => item.specialization === specialization);
    if (specializationData) {
      const careerDetail = specializationData.careers.find(c => c.name === career);
      if (careerDetail) {
        res.json({ skills: careerDetail.requiredSkills });
      } else {
        res.status(404).json({ message: 'Career not found' });
      }
    } else {
      res.status(404).json({ message: 'Specialization not found' });
    }
  });
  
  // Endpoint: SkillDevelopmentResources()
  app.get('/skill-development-resources', (req, res) => {
    const { specialization, career } = req.query;
    const specializationData = careerData.find(item => item.specialization === specialization);
    if (specializationData) {
      const careerDetail = specializationData.careers.find(c => c.name === career);
      if (careerDetail) {
        res.json({ resources: careerDetail.resources });
      } else {
        res.status(404).json({ message: 'Career not found' });
      }
    } else {
      res.status(404).json({ message: 'Specialization not found' });
    }
  });
  


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});