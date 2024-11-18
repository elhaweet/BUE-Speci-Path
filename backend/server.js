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
        description: 'A Machine Learning Engineer is responsible for designing, building, and deploying machine learning models and algorithms that can analyze large amounts of data and draw insights from them. They work across various domains, including finance, healthcare, marketing, and more, to solve complex problems such as predicting customer behavior, diagnosing diseases, and optimizing operations. This role requires a strong understanding of statistics, programming, and data analysis, along with expertise in tools like TensorFlow and Python.',
        requiredSkills: ['Python', 'TensorFlow', 'Data Analysis', 'Deep Learning', 'Data Preprocessing', 'Feature Engineering', 'Model Evaluation', 'Statistical Analysis'],
        resources: [
          { title: "Coursera: Machine Learning by Andrew Ng", link: "https://www.coursera.org/learn/machine-learning" },
          { title: "Udacity: Deep Learning Nanodegree", link: "https://www.udacity.com/course/deep-learning-nanodegree--nd101" },
          { title: "Fast.ai: Practical Deep Learning for Coders", link: "https://www.fast.ai/" },
          { title: "Kaggle: Data Science Courses", link: "https://www.kaggle.com/learn/overview" }
        ]
      },
      
      {
        name: 'AI Research Scientist',
        description: 'AI Research Scientists conduct advanced research to develop innovative algorithms and technologies in the field of artificial intelligence. They often focus on creating new models, improving existing ones, and publishing their findings in academic journals and conferences. This role requires a deep understanding of mathematics, programming, and research methodologies, as well as the ability to think critically and solve complex problems.',
        requiredSkills: ['Mathematics', 'Research Skills', 'Programming', 'Advanced Algorithms', 'Optimization', 'Statistical Modeling', 'Data Mining', 'Critical Thinking'],
        resources: [
          { title: "edX: AI for Everyone", link: "https://www.edx.org/course/ai-for-everyone" },
          { title: "Kaggle: Advanced ML Techniques", link: "https://www.kaggle.com/learn/advanced-machine-learning-techniques" },
          { title: "MIT OpenCourseWare: Artificial Intelligence", link: "https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-034-artificial-intelligence-spring-2010/" },
          { title: "Stanford CS231n: Deep Learning for Computer Vision", link: "http://cs231n.stanford.edu/" }
        ]
      },
      
      {
        name: 'Robotics Engineer',
        description: 'Robotics Engineers design and develop robotic systems capable of performing tasks autonomously or semi-autonomously. They work in various fields, including manufacturing, healthcare, and space exploration, focusing on creating robots that can improve efficiency and safety. This role requires skills in mechanical engineering, programming, and control systems, as well as knowledge of robotics frameworks and sensor integration.',
        requiredSkills: ['C++', 'Robotics Frameworks', 'Mechanical Engineering', 'Control Systems', 'Computer Vision', 'Sensor Integration', 'Kinematics', 'Programming'],
        resources: [
          { title: "Robotics Certification by MIT", link: "https://www.edx.org/professional-certificate/mitx-robotics" },
          { title: "Robotics Specialization on Coursera", link: "https://www.coursera.org/specializations/robotics" },
          { title: "Introduction to Robotics by Stanford", link: "http://robotics.stanford.edu/" },
          { title: "Robotics: Perception by University of Maryland", link: "https://www.coursera.org/learn/robotics-perception" }
        ]
      },
      
      {
        name: 'Natural Language Processing (NLP) Engineer',
        description: 'NLP Engineers develop systems that enable machines to understand, interpret, and generate human language. This includes creating applications such as chatbots, translation services, and sentiment analysis tools. The role requires expertise in linguistics, programming, and machine learning, as well as familiarity with NLP libraries and techniques.',
        requiredSkills: ['Linguistics', 'Python', 'NLP Libraries (spaCy, NLTK)', 'Text Mining', 'Machine Translation', 'Deep Learning', 'Data Annotation', 'Model Deployment'],
        resources: [
          { title: "Stanford NLP Course", link: "https://web.stanford.edu/class/cs224n/" },
          { title: "Hugging Face Tutorials", link: "https://huggingface.co/learn/nlp-course/" },
          { title: "Deep Learning for NLP with PyTorch", link: "https://pytorch.org/tutorials/begin ner/nlp/index.html" },
          { title: "Coursera: NLP Specialization by Deeplearning.ai", link: "https://www.coursera.org/specializations/natural-language-processing" }
        ]
      },
      
      {
        name: 'Computer Vision Engineer',
        description: 'Computer Vision Engineers create algorithms and systems that allow computers to interpret and understand visual information from the world. They work on applications such as autonomous vehicles, surveillance systems, and augmented reality. This role requires a strong background in image processing, deep learning, and computer vision algorithms, along with proficiency in programming languages and frameworks like OpenCV and TensorFlow.',
        requiredSkills: ['OpenCV', 'Deep Learning', 'TensorFlow/Keras', 'Image Processing', 'CV Algorithms', '3D Reconstruction', 'Image Segmentation', 'Feature Detection'],
        resources: [
          { title: "Coursera: Introduction to Computer Vision with TensorFlow", link: "https://www.coursera.org/learn/introduction-to-computer-vision-with-tensorflow" },
          { title: "Udacity: Computer Vision Nanodegree", link: "https://www.udacity.com/course/computer-vision-nanodegree--nd891" },
          { title: "PyImageSearch Blog", link: "https://www.pyimagesearch.com/" },
          { title: "Deep Learning for Computer Vision by Adrian Rosebrock", link: "https://www.pyimagesearch.com/deep-learning-computer-vision-python-spring-2020/" }
        ]
      },
      
      {
        name: 'AI Product Manager',
        description: 'AI Product Managers lead the development and integration of AI technologies into products and services. They ensure that AI solutions align with business goals and user needs, often collaborating with cross-functional teams to deliver successful products. This role requires a blend of product management skills, technical knowledge of AI technologies, and a strong understanding of market dynamics.',
        requiredSkills: ['Product Management', 'AI Technology', 'Business Strategy', 'Market Research', 'User  Experience Design', 'Agile Methodologies', 'Stakeholder Management'],
        resources: [
          { title: "AI for Product Managers by Coursera", link: "https://www.coursera.org/learn/ai-for-product-managers" },
          { title: "Stanford: AI Product Management", link: "https://online.stanford.edu/courses/sohs-ystart-ai-product-management" },
          { title: "The Lean Startup by Eric Ries", link: "https://leanstartup.co/" },
          { title: "Harvard: AI in Business", link: "https://online.hbs.edu/courses/ai-in-business/" }
        ]
      }
    ]
  },
  {
    specialization: 'SE (Software Engineering)',
    careers: [
      {
        name: 'Software Developer',
        description: 'Software Developers create software solutions by analyzing user needs and developing applications that meet those needs. They often collaborate with other developers and stakeholders to ensure that the software is functional, user-friendly, and efficient. This role requires strong programming skills, problem-solving abilities, and knowledge of software development methodologies.',
        requiredSkills: ['JavaScript', 'Problem Solving', 'Version Control', 'Object-Oriented Programming', 'Database Integration', 'API Development', 'Testing', 'Debugging'],
        resources: [
          { title: "Udemy: The Complete Web Developer Course", link: "https://www.udemy.com/course/the-complete-web-developer-course-2/" },
          { title: "Pluralsight: Software Design Patterns", link: "https://www.pluralsight.com/courses/software-design-patterns" },
          { title: "Codecademy: Learn JavaScript", link: "https://www.codecademy.com/learn/learn-javascript" },
          { title: "freeCodeCamp: Full Stack Developer Certification", link: "https://www.freecodecamp.org/learn/responsive-web-design/" }
        ]
      },
      
      {
        name: 'DevOps Engineer',
        description: 'DevOps Engineers facilitate collaboration between development and operations teams to automate and streamline software development processes. They focus on ensuring faster delivery and higher quality of software products by implementing CI/CD practices, managing cloud infrastructure, and monitoring system performance. This role requires a strong understanding of both development and operational practices, along with expertise in various tools and technologies.',
        requiredSkills: ['CI/CD Tools', 'Cloud Platforms', 'Scripting', 'Infrastructure as Code', 'Containers (Docker/Kubernetes)', 'Monitoring', 'Collaboration', 'Security'],
        resources: [
          { title: "LinkedIn Learning: DevOps Foundations", link: "https://www.linkedin.com/learning/devops-foundations-2" },
          { title: "AWS Training: DevOps on AWS", link: "https:// www.aws.amazon.com/training/devops/" },
          { title: "Kubernetes for Developers by Udemy", link: "https://www.udemy.com/course/kubernetes-for-developers/" },
          { title: "Terraform on Pluralsight", link: "https://www.pluralsight.com/courses/terraform-getting-started" }
        ]
      },
      
      {
        name: 'Full Stack Developer',
        description: 'Full Stack Developers are responsible for both client-side and server-side development of applications. They ensure seamless integration and functionality across the entire stack, working with various technologies and frameworks. This role requires proficiency in frontend and backend technologies, as well as a strong understanding of databases and APIs.',
        requiredSkills: ['HTML/CSS', 'Node.js', 'React/Vue/Angular', 'Databases', 'RESTful APIs', 'Responsive Design', 'Version Control', 'Testing'],
        resources: [
          { title: "Full Stack Web Developer Bootcamp", link: "https://www.udemy.com/course/the-complete-web-developer-bootcamp/" },
          { title: "Frontend Masters: Full Stack Advanced Topics", link: "https://frontendmasters.com/courses/full-stack-advanced/" },
          { title: "The Complete Web Developer Bootcamp by Colt Steele", link: "https://www.udemy.com/course/the-complete-web-developer-bootcamp/" },
          { title: "MongoDB University: Full Stack Development with Node.js and MongoDB", link: "https://university.mongodb.com/courses/M001/about" }
        ]
      },
      
      {
        name: 'Backend Engineer',
        description: 'Backend Engineers focus on server-side logic, database interaction, and API development. They ensure that applications run smoothly and efficiently, often working with various databases and server technologies. This role requires strong programming skills, knowledge of database management, and an understanding of security practices.',
        requiredSkills: ['Node.js', 'Databases', 'RESTful APIs', 'Security', 'Authentication', 'Performance Optimization', 'Scalability', 'Testing'],
        resources: [
          { title: "Backend Development on Pluralsight", link: "https://www.pluralsight.com/courses/backend-development" },
          { title: "Coursera: Backend with Node.js", link: "https://www.coursera.org/learn/backend-nodejs" },
          { title: "LinkedIn Learning: Learning SQL Programming", link: "https://www.linkedin.com/learning/learning-sql-programming" },
          { title: "Node.js Documentation", link: "https://nodejs.org/en/docs/" }
        ]
      },
      
      {
        name: 'Web Developer',
        description: 'Web Developers design and develop websites and web applications using a combination of frontend and backend technologies. They ensure a responsive and user-friendly experience, often focusing on performance optimization and cross-browser compatibility. This role requires a strong understanding of web technologies and design principles.',
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'Responsive Design', 'Version Control', 'Cross-Browser Compatibility', 'SEO Principles', 'Performance Optimization'],
        resources: [
          { title: "freeCodeCamp: Frontend Developer Certification", link: "https://www.freecodecamp.org/learn/front-end-development-libraries/" },
          { title: "MDN Web Docs (HTML/CSS/JS)", link: "https://developer.mozilla.org/en-US/docs/Web" },
          { title: "Udemy: Modern Web Development from Scratch", link: "https://www.udemy.com/course/modern-web-development-from-scratch/" },
          { title: "Codecademy: Web Development Career Path", link: "https://www.codecademy.com/learn/paths/web-development" }
        ]
      },
      
      {
        name: 'Mobile App Developer',
        description: 'Mobile App Developers create and maintain mobile applications for iOS and Android platforms. They focus on user experience and performance optimization, often utilizing frameworks and tools specific to mobile development. This role requires knowledge of mobile UI/UX design principles and proficiency in programming languages like Swift and Kotlin.',
        requiredSkills: ['Swift', 'Kotlin', 'React Native', 'Flutter', 'Mobile UI/UX Design', 'API Integration', 'Testing', 'Deployment'],
        resources: [
          { title: "Udemy: iOS 16 & SwiftUI Bootcamp", link: "https://www.udemy.com/course/ios-16-swiftui-bootcamp/" },
          { title: "Codecademy: Learn Kotlin", link: "https://www.codecademy.com/learn/learn-kotlin" },
          { title: "Flutter Documentation", link: "https://flutter.dev/docs" },
          { title: "Google Developer Training for Android", link: "https://developer.android.com/courses " }
        ]
      },
      
      {
        name: 'Embedded Systems Engineer',
        description: 'Embedded Systems Engineers design software and firmware for embedded systems used in various hardware applications. They ensure reliability and efficiency in the operation of these systems, often working with microcontrollers and real-time operating systems. This role requires strong programming skills, knowledge of hardware integration, and an understanding of low-level programming concepts.',
        requiredSkills: ['C/C++', 'Embedded Linux', 'Microcontrollers', 'Real-Time Operating Systems (RTOS)', 'Firmware Development', 'Debugging', 'Hardware Integration', 'Low-Level Programming'],
        resources: [
          { title: "Coursera: Introduction to Embedded Systems Software", link: "https://www.coursera.org/learn/introduction-to-embedded-systems-software" },
          { title: "Udemy: Embedded Systems Programming on ARM Cortex-M3/M4", link: "https://www.udemy.com/course/embedded-systems-programming-on-arm-cortex-m3-m4/" },
          { title: "MIT OpenCourseWare: Embedded Systems", link: "https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-111sc-introduction-to-embedded-systems-spring-2011/" },
          { title: "FreeRTOS Documentation", link: "https://www.freertos.org/" }
        ]
      }
    ]
  },
  {
    specialization: 'IS (Information Systems)',
    careers: [
      {
        name: 'IT Consultant',
        description: 'IT Consultants analyze and evaluate IT systems to meet business needs, providing strategic advice on technology and system improvements. They work closely with clients to understand their requirements and recommend solutions that enhance efficiency and effectiveness. This role requires strong analytical skills, technical knowledge, and excellent communication abilities.',
        requiredSkills: ['Business Analysis', 'Technical Writing', 'Communication', 'Project Management', 'Enterprise Architecture', 'Stakeholder Engagement', 'Change Management', 'Risk Assessment'],
        resources: [
          { title: "Coursera: IT Fundamentals", link: "https://www.coursera.org/learn/it-fundamentals" },
          { title: "edX: IT Management", link: "https://www.edx.org/course/it-management" },
          { title: "Udemy: Business Analysis Fundamentals", link: "https://www.udemy.com/course/business-analysis-fundamentals/" },
          { title: "LinkedIn Learning: ITIL Foundation", link: "https://www.linkedin.com/learning/itil-foundation-2011" }
        ]
      },
      
      {
        name: 'Systems Analyst',
        description: 'Systems Analysts design and implement IT solutions that improve business efficiency. They act as a bridge between stakeholders and technical teams, ensuring that the solutions meet user needs and business objectives. This role requires strong analytical skills, project management abilities, and a solid understanding of database management and business intelligence.',
        requiredSkills: ['Systems Analysis', 'Project Management', 'Database Management', 'Business Intelligence', 'Agile Methodology', 'Requirements Gathering', 'Documentation', 'Testing'],
        resources: [
          { title: "Udemy: Systems Analysis & Design", link: "https://www.udemy.com/course/systems-analysis-design/" },
          { title: "Pluralsight: Database Fundamentals", link: "https://www.pluralsight.com/courses/database-fundamentals" },
          { title: "edX: Systems Analysis", link: "https://www.edx.org/course/systems-analysis" },
          { title: "Coursera: Business Process Modeling", link: "https://www.coursera.org/learn/business-process-modeling" }
        ]
      },
      
      {
        name: 'Business Intelligence (BI) Analyst',
        description: 'Business Intelligence Analysts utilize data analysis tools to support decision-making within an organization. They transform data into actionable insights through reporting and visualization, helping businesses understand trends and make informed decisions. This role requires strong analytical skills, proficiency in SQL, and experience with dashboarding tools.',
        requiredSkills: ['Data Analytics', 'SQL', 'Dashboarding Tools', 'Data Warehousing', 'ETL Processes', 'Statistical Analysis', 'Data Governance', 'Business Acumen'],
        resources: [
          { title: "Data Visualization with Tableau", link: "https://www.coursera.org/learn/data-visualization-tableau" },
          { title: "Power BI Course by Microsoft", link: "https://www.microsoft.com/en-us/learning/power-bi-training.aspx" },
          { title: "Coursera: Business Intelligence Specialization", link: "https://www.coursera.org/specializations/business-intelligence" },
          { title: "Udemy: Learn SQL for Data Science", link: "https://www.udemy.com/course/ learn-sql-for-data-science/" }
        ]
      },
      
      {
        name: 'Database Administrator',
        description: 'Database Administrators are responsible for managing and maintaining database systems to ensure optimal performance, security, and availability of data. They handle tasks such as database design, backup and recovery, and performance tuning, ensuring that data is stored securely and can be accessed efficiently. This role requires strong technical skills in SQL and database management systems, along with problem-solving abilities.',
        requiredSkills: ['SQL', 'Database Design', 'Backup and Recovery', 'Performance Tuning', 'Replication', 'Data Modeling', 'Security Management', 'Troubleshooting'],
        resources: [
          { title: "Database Management on Udemy", link: "https://www.udemy.com/course/database-management/" },
          { title: "Oracle DB Training", link: "https://education.oracle.com/oracle-database-training/overview/pls/odbc" },
          { title: "SQL Server Training on Pluralsight", link: "https://www.pluralsight.com/courses/sql-server-training" },
          { title: "MongoDB University", link: "https://university.mongodb.com/" }
        ]
      },
      
      {
        name: 'IT Project Manager',
        description: 'IT Project Managers oversee technology projects from inception to completion, ensuring they are delivered on time, within scope, and within budget. They coordinate teams, manage resources, and communicate with stakeholders to ensure project success. This role requires strong project management skills, risk management abilities, and leadership qualities.',
        requiredSkills: ['Project Management', 'Risk Management', 'Budgeting', 'Agile/Scrum', 'Team Leadership', 'Stakeholder Communication', 'Resource Management', 'Quality Assurance'],
        resources: [
          { title: "Project Management Professional (PMP) Certification", link: "https://www.pmi.org/certifications/project-management-pmp" },
          { title: "Coursera: IT Project Management", link: "https://www.coursera.org/learn/it-project-management" },
          { title: "Udemy: Agile Project Management", link: "https://www.udemy.com/course/agile-project-management/" },
          { title: "LinkedIn Learning: Leading Project Teams", link: "https://www.linkedin.com/learning/leading-project-teams" }
        ]
      },
      
      {
        name: 'Cloud Architect',
        description: 'Cloud Architects design cloud infrastructure and services for businesses, ensuring scalability, security, and cost-effectiveness in cloud solutions. They work with various cloud platforms to create architectures that meet business needs and optimize performance. This role requires expertise in cloud technologies, architecture design, and a strong understanding of security and compliance.',
        requiredSkills: ['Cloud Platforms (AWS/Azure/GCP)', 'Architecture Design', 'Security', 'Cost Optimization', 'DevOps Practices', 'Networking', 'Disaster Recovery', 'Compliance'],
        resources: [
          { title: "AWS Certified Solutions Architect", link: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" },
          { title: "Google Cloud Architect Training", link: "https://cloud.google.com/certification/cloud-architect" },
          { title: "Microsoft Azure Architect Certification", link: "https://learn.microsoft.com/en-us/certifications/azure-architect-design/" },
          { title: "Cloud Academy: Cloud Architect Learning Path", link: "https://cloudacademy.com/learning-paths/cloud-architect-learning-path-100/" }
        ]
      }
    ]
  },
  {
    specialization: 'CN (Computer Networks)',
    careers: [
      {
        name: 'Network Administrator',
        description: 'Network Administrators manage and maintain computer networks and related computing environments, ensuring network availability and performance. They handle tasks such as network configuration, monitoring, and troubleshooting, ensuring that all network components function optimally. This role requires strong technical skills in networking protocols and systems, along with problem-solving abilities.',
        requiredSkills: ['Networking Protocols', 'Firewall Management', 'Troubleshooting', 'TCP/IP', 'VPN', 'Network Monitoring', 'Configuration Management', 'Documentation'],
        resources: [
          { title: "Cisco: CCNA Certification", link: "https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html" },
          { title: "CompTIA Network+ Training", link: "https://www.comptia.org/certifications/network" },
          { title: "LinkedIn Learning: Networking Foundations", link: "https://www.linkedin.com/learning/networking-foundations-2" },
          { title: "Udemy: Introduction to Networking", link: "https://www.udemy.com/course/introduction-to-networking/" }
        ]
      },
      
      {
        name : 'Network Security Specialist',
        description: 'Network Security Specialists ensure the security and integrity of an organization’s network by implementing security measures and monitoring for potential threats. They are responsible for configuring firewalls, conducting vulnerability assessments, and responding to security incidents. This role requires a strong understanding of cybersecurity principles, risk assessment, and incident response strategies.',
        requiredSkills: ['Cybersecurity', 'Encryption Methods', 'Incident Response', 'Firewall Configuration', 'Ethical Hacking', 'Network Forensics', 'Risk Assessment', 'Security Policies'],
        resources: [
          { title: "Cybersecurity Fundamentals by IBM", link: "https://www.ibm.com/training/cybersecurity-fundamentals" },
          { title: "SANS Cyber Aces", link: "https://www.cyberaces.org/" },
          { title: "CompTIA Security+", link: "https://www.comptia.org/certifications/security" },
          { title: "Certified Ethical Hacker (CEH) Course", link: "https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/" }
        ]
      },
      
      {
        name: 'Cloud Network Engineer',
        description: 'Cloud Network Engineers design and manage cloud-based network solutions, ensuring scalability and security in cloud environments. They work with cloud service providers to implement networking solutions that meet business requirements and optimize performance. This role requires expertise in cloud networking technologies, automation, and security best practices.',
        requiredSkills: ['Cloud Networking', 'AWS/Azure/GCP', 'Automation', 'Cloud Security', 'SD-WAN', 'Network Architecture', 'Load Balancing', 'Monitoring'],
        resources: [
          { title: "Cloud Networking on AWS", link: "https://aws.amazon.com/training/course-descriptions/cloud-networking/" },
          { title: "Azure Network Engineer Training", link: "https://learn.microsoft.com/en-us/certifications/azure-network-engineer-associate/" },
          { title: "Google Cloud Training: Network Engineering", link: "https://cloud.google.com/training/certification/cloud-network-engineer" },
          { title: "Udacity: Cloud DevOps Nanodegree", link: "https://www.udacity.com/course/cloud-devops-nanodegree--nd9990" }
        ]
      },
      
      {
        name: 'VoIP Engineer',
        description: 'VoIP Engineers specialize in the installation and maintenance of Voice over IP (VoIP) systems, ensuring high-quality voice communication over networks. They configure VoIP systems, troubleshoot issues, and optimize performance to provide reliable communication solutions. This role requires knowledge of SIP protocols, network configuration, and unified communications.',
        requiredSkills: ['SIP Protocols', 'Network Configuration', 'Unified Communications', 'VoIP Security', 'Call Routing', 'Quality of Service (QoS)', 'Troubleshooting', 'System Integration'],
        resources: [
          { title: "VoIP Training by Cisco", link: "https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna-voice.html" },
          { title: "Asterisk VOIP Certification", link: "https://www.asterisk.org/" },
          { title: "LinkedIn Learning: VoIP Fundamentals", link: "https://www.linkedin.com/learning/voip-fundamentals" },
          { title: "Udemy: Introduction to Asterisk and VoIP", link: "https://www.udemy.com/course/introduction-to-asterisk-and-voip/" }
        ]
      },
      
      {
        name: 'Network Operations Center (NOC) Engineer',
        description: 'NOC Engineers monitor and support networks to ensure their reliability and uptime. They respond to incidents, perform maintenance tasks, and ensure that network performance meets organizational standards. This role requires strong technical skills in network monitoring tools, incident management, and effective communication.',
        requiredSkills: ['Network Monitoring Tools', 'Incident Management', 'Troubleshooting', 'TCP/IP', 'Documentation', 'Communication Skills', 'Problem Solving', 'Team Collaboration'],
        resources: [
          { title: "Udemy: NOC Engineer Training", link: "https://www.udemy.com/course/noc-engineer-training/" },
          { title: "Cisco: Network Operations Professional", link: "https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html" },
          { title: "CompTIA Network+", link: "https://www.comptia.org/certifications/network" },
          { title: "LinkedIn Learning: Network Operations Center Fundamentals", link: "https://www.linkedin.com/learning/network-operations-center-fundamentals" }
        ]
      }
    ]
  },
  {
    specialization: 'CS (Computer Science)',
    careers: [
      {
        name: 'Software Engineer',
        description: 'Software Engineers develop, test, and maintain software applications, often collaborating with cross-functional teams to deliver high-quality software solutions. They are involved in the entire software development lifecycle, from requirements gathering to deployment and maintenance. This role requires strong programming skills, problem-solving abilities, and a solid understanding of software design principles and methodologies.',
        requiredSkills: ['Programming', 'Problem Solving', 'Version Control', 'Data Structures', 'Algorithms', 'Software Development Life Cycle (SDLC)', 'Testing', 'Debugging'],
        resources: [
          { title: "Udemy: Complete Python Course", link: "https://www.udemy.com/course/complete-python-bootcamp/" },
          { title: "Coursera: Data Structures and Algorithms", link: "https://www.coursera.org/learn/data-structures-algorithms" },
          { title: "MIT OpenCourseWare: Introduction to Algorithms", link: "https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-006-introduction-to-algorithms-fall-2011/" },
          { title: "LeetCode: Coding Challenges", link: "https://leetcode.com/" }
        ]
      },
      
      {
        name: 'Data Scientist',
        description: 'Data Scientists analyze and interpret complex data to help organizations make informed decisions. They utilize statistical methods and machine learning techniques to extract insights from data, often working with large datasets and employing data visualization tools to communicate findings. This role requires a strong foundation in statistics, programming, and data analysis, along with excellent communication skills.',
        requiredSkills: ['Statistics', 'Machine Learning', 'Data Visualization', 'Python/R', 'Big Data', 'Data Cleaning', 'Feature Engineering', 'Communication Skills'],
        resources: [
          { title: "DataCamp: Data Science Bootcamp", link: "https://www.datacamp.com/tracks/data-scientist" },
          { title: "Kaggle: Intro to Machine Learning", link: "https://www.kaggle.com/learn/intro-to-machine-learning" },
          { title: "Coursera: Data Science Specialization by Johns Hopkins", link: "https://www.coursera.org/specializations/jhu-data-science" },
          { title: "edX: Big Data Analytics for Business", link: "https://www.edx.org/course/big-data-analytics-for-business" }
        ]
      },
      
      {
        name: 'Cybersecurity Analyst',
        description: 'Cybersecurity Analysts monitor and protect computer systems and networks from security breaches. They implement security measures, conduct vulnerability assessments, and respond to incidents to safeguard sensitive information. This role requires a strong understanding of cybersecurity principles, threat detection, and incident response strategies, along with excellent analytical skills.',
        requiredSkills: ['Threat Detection', 'Penetration Testing', 'SIEM Tools', 'Incident Response', 'Malware Analysis', 'Risk Assessment', 'Security Policies', 'Communication Skills'],
        resources: [
          { title: "CompTIA Security+", link: "https://www.comptia.org/certifications/security" },
          { title: "CISSP Training by ISC2", link: "https://www.isc2.org/Certifications/CISSP" },
          { title: "Udemy: Ethical Hacking from Scratch", link: "https://www.udemy.com/course/ethical-hacking-from-scratch/" },
          { title: "Cybrary: Security Analyst Career Path", link: "https://www.cybrary.it/course/security-analyst-career-path/" }
        ]
      },
      
      {
        name: 'Game Developer',
        description: 'Game Developers create and develop video games for various platforms, focusing on gameplay mechanics, graphics, and user experience. They work with game engines and programming languages to design and implement game features, often collaborating with artists and designers. This role requires creativity, strong programming skills, and a solid understanding of game design principles.',
        requiredSkills: ['C#', 'Unity/Unreal Engine', 'Game Design', '3D Modeling', 'Animation', 'Problem Solving', 'Creativity', 'Team Collaboration'],
        resources: [
          { title: "Game Development on Udemy", link: "https://www.udemy.com/course/game-development-bootcamp/" },
          { title: "Unity Learn Platform", link: "https://learn.unity.com/" },
          { title: "Unreal Engine Documentation", link: "https://docs.unrealengine.com/en-US/index.html" },
          { title: "Coursera: Game Design and Development", link: "https://www.coursera.org/learn/game-design-development" }
        ]
      },
      
      {
        name: 'Cloud Software Engineer',
        description: 'Cloud Software Engineers design and develop software specifically for cloud platforms, focusing on scalability, reliability, and performance. They work with cloud services to create applications that leverage cloud computing capabilities, ensuring that software solutions are optimized for cloud environments. This role requires knowledge of cloud architecture, microservices, and API development, along with strong programming skills.',
        requiredSkills: ['AWS/Azure/GCP', 'Cloud Development', 'Microservices', 'Serverless Architecture', 'API Development', 'DevOps Practices', 'Security', 'Collaboration'],
        resources: [
          { title: "AWS Certified Developer – Associate", link: "https://aws.amazon.com/certification/certified-developer-associate/" },
          { title: "Microsoft Azure Development Certification", link: "https://learn.microsoft.com/en-us/certifications/azure-developer-associate/" },
          { title: "Google Cloud Developer Certification", link: "https://cloud.google.com/certification/cloud-developer" },
          { title: "Udacity Cloud Developer Nanodegree", link: "https://www.udacity.com/course/cloud-developer-nanodegree--nd9990" }
        ]
      }
    ]
  }
];

  
  app.get('/explore-career-options', (req, res) => {
    const { specialization } = req.query;
    const result = careerData.find(item => item.specialization === specialization);
    if (result) {
      res.json(result.careers);
    } else {
      res.status(404).json({ message: 'Specialization not found' });
    }
  });

  app.get('/get-specializations', (req, res) => {
    const specializations = careerData.map(item => item.specialization);
    if (specializations.length > 0) {
      res.json(specializations);
    } else {
      res.status(404).json({ message: 'No specializations found' });
    }
  });


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});