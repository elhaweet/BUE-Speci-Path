const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

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
const careerData = [
  {
    specialization: "Artificial Intelligence",
    careers: [
      {
        name: "Machine Learning Engineer",
        description:
          "A Machine Learning Engineer is responsible for designing, building, and deploying machine learning models and algorithms that can analyze large amounts of data and draw insights from them. They work across various domains, including finance, healthcare, marketing, and more, to solve complex problems such as predicting customer behavior, diagnosing diseases, and optimizing operations. This role requires a strong understanding of statistics, programming, and data analysis, along with expertise in tools like TensorFlow and Python.",
        requiredSkills: [
          "Python",
          "TensorFlow",
          "Data Analysis",
          "Deep Learning",
          "Data Preprocessing",
          "Feature Engineering",
          "Model Evaluation",
          "Statistical Analysis",
        ],
      },

      {
        name: "AI Research Scientist",
        description:
          "AI Research Scientists conduct advanced research to develop innovative algorithms and technologies in the field of artificial intelligence. They often focus on creating new models, improving existing ones, and publishing their findings in academic journals and conferences. This role requires a deep understanding of mathematics, programming, and research methodologies, as well as the ability to think critically and solve complex problems.",
        requiredSkills: [
          "Mathematics",
          "Research Skills",
          "Programming",
          "Advanced Algorithms",
          "Optimization",
          "Statistical Modeling",
          "Data Mining",
          "Critical Thinking",
        ],
      },

      {
        name: "Robotics Engineer",
        description:
          "Robotics Engineers design and develop robotic systems capable of performing tasks autonomously or semi-autonomously. They work in various fields, including manufacturing, healthcare, and space exploration, focusing on creating robots that can improve efficiency and safety. This role requires skills in mechanical engineering, programming, and control systems, as well as knowledge of robotics frameworks and sensor integration.",
        requiredSkills: [
          "C++",
          "Robotics Frameworks",
          "Mechanical Engineering",
          "Control Systems",
          "Computer Vision",
          "Sensor Integration",
          "Kinematics",
          "Programming",
        ],
      },

      {
        name: "Natural Language Processing (NLP) Engineer",
        description:
          "NLP Engineers develop systems that enable machines to understand, interpret, and generate human language. This includes creating applications such as chatbots, translation services, and sentiment analysis tools. The role requires expertise in linguistics, programming, and machine learning, as well as familiarity with NLP libraries and techniques.",
        requiredSkills: [
          "Linguistics",
          "Python",
          "NLP Libraries (spaCy, NLTK)",
          "Text Mining",
          "Machine Translation",
          "Deep Learning",
          "Data Annotation",
          "Model Deployment",
        ],
      },

      {
        name: "Computer Vision Engineer",
        description:
          "Computer Vision Engineers create algorithms and systems that allow computers to interpret and understand visual information from the world. They work on applications such as autonomous vehicles, surveillance systems, and augmented reality. This role requires a strong background in image processing, deep learning, and computer vision algorithms, along with proficiency in programming languages and frameworks like OpenCV and TensorFlow.",
        requiredSkills: [
          "OpenCV",
          "Deep Learning",
          "TensorFlow/Keras",
          "Image Processing",
          "CV Algorithms",
          "3D Reconstruction",
          "Image Segmentation",
          "Feature Detection",
        ],
      },

      {
        name: "AI Product Manager",
        description:
          "AI Product Managers lead the development and integration of AI technologies into products and services. They ensure that AI solutions align with business goals and user needs, often collaborating with cross-functional teams to deliver successful products. This role requires a blend of product management skills, technical knowledge of AI technologies, and a strong understanding of market dynamics.",
        requiredSkills: [
          "Product Management",
          "AI Technology",
          "Business Strategy",
          "Market Research",
          "User  Experience Design",
          "Agile Methodologies",
          "Stakeholder Management",
        ],
      },
    ],
  },
  {
    specialization: "Software Engineering",
    careers: [
      {
        name: "Software Developer",
        description:
          "Software Developers create software solutions by analyzing user needs and developing applications that meet those needs. They often collaborate with other developers and stakeholders to ensure that the software is functional, user-friendly, and efficient. This role requires strong programming skills, problem-solving abilities, and knowledge of software development methodologies.",
        requiredSkills: [
          "JavaScript",
          "Problem Solving",
          "Version Control",
          "Object-Oriented Programming",
          "Database Integration",
          "API Development",
          "Testing",
          "Debugging",
        ],
      },

      {
        name: "DevOps Engineer",
        description:
          "DevOps Engineers facilitate collaboration between development and operations teams to automate and streamline software development processes. They focus on ensuring faster delivery and higher quality of software products by implementing CI/CD practices, managing cloud infrastructure, and monitoring system performance. This role requires a strong understanding of both development and operational practices, along with expertise in various tools and technologies.",
        requiredSkills: [
          "CI/CD Tools",
          "Cloud Platforms",
          "Scripting",
          "Infrastructure as Code",
          "Containers (Docker/Kubernetes)",
          "Monitoring",
          "Collaboration",
          "Security",
        ],
      },

      {
        name: "Full Stack Developer",
        description:
          "Full Stack Developers are responsible for both client-side and server-side development of applications. They ensure seamless integration and functionality across the entire stack, working with various technologies and frameworks. This role requires proficiency in frontend and backend technologies, as well as a strong understanding of databases and APIs.",
        requiredSkills: [
          "HTML/CSS",
          "Node.js",
          "React/Vue/Angular",
          "Databases",
          "RESTful APIs",
          "Responsive Design",
          "Version Control",
          "Testing",
        ],
      },

      {
        name: "Backend Engineer",
        description:
          "Backend Engineers focus on server-side logic, database interaction, and API development. They ensure that applications run smoothly and efficiently, often working with various databases and server technologies. This role requires strong programming skills, knowledge of database management, and an understanding of security practices.",
        requiredSkills: [
          "Node.js",
          "Databases",
          "RESTful APIs",
          "Security",
          "Authentication",
          "Performance Optimization",
          "Scalability",
          "Testing",
        ],
      },

      {
        name: "Web Developer",
        description:
          "Web Developers design and develop websites and web applications using a combination of frontend and backend technologies. They ensure a responsive and user-friendly experience, often focusing on performance optimization and cross-browser compatibility. This role requires a strong understanding of web technologies and design principles.",
        requiredSkills: [
          "HTML",
          "CSS",
          "JavaScript",
          "Responsive Design",
          "Version Control",
          "Cross-Browser Compatibility",
          "SEO Principles",
          "Performance Optimization",
        ],
      },

      {
        name: "Mobile App Developer",
        description:
          "Mobile App Developers create and maintain mobile applications for iOS and Android platforms. They focus on user experience and performance optimization, often utilizing frameworks and tools specific to mobile development. This role requires knowledge of mobile UI/UX design principles and proficiency in programming languages like Swift and Kotlin.",
        requiredSkills: [
          "Swift",
          "Kotlin",
          "React Native",
          "Flutter",
          "Mobile UI/UX Design",
          "API Integration",
          "Testing",
          "Deployment",
        ],
      },

      {
        name: "Embedded Systems Engineer",
        description:
          "Embedded Systems Engineers design software and firmware for embedded systems used in various hardware applications. They ensure reliability and efficiency in the operation of these systems, often working with microcontrollers and real-time operating systems. This role requires strong programming skills, knowledge of hardware integration, and an understanding of low-level programming concepts.",
        requiredSkills: [
          "C/C++",
          "Embedded Linux",
          "Microcontrollers",
          "Real-Time Operating Systems (RTOS)",
          "Firmware Development",
          "Debugging",
          "Hardware Integration",
          "Low-Level Programming",
        ],
      },
    ],
  },
  {
    specialization: "Information Systems",
    careers: [
      {
        name: "IT Consultant",
        description:
          "IT Consultants analyze and evaluate IT systems to meet business needs, providing strategic advice on technology and system improvements. They work closely with clients to understand their requirements and recommend solutions that enhance efficiency and effectiveness. This role requires strong analytical skills, technical knowledge, and excellent communication abilities.",
        requiredSkills: [
          "Business Analysis",
          "Technical Writing",
          "Communication",
          "Project Management",
          "Enterprise Architecture",
          "Stakeholder Engagement",
          "Change Management",
          "Risk Assessment",
        ],
      },

      {
        name: "Systems Analyst",
        description:
          "Systems Analysts design and implement IT solutions that improve business efficiency. They act as a bridge between stakeholders and technical teams, ensuring that the solutions meet user needs and business objectives. This role requires strong analytical skills, project management abilities, and a solid understanding of database management and business intelligence.",
        requiredSkills: [
          "Systems Analysis",
          "Project Management",
          "Database Management",
          "Business Intelligence",
          "Agile Methodology",
          "Requirements Gathering",
          "Documentation",
          "Testing",
        ],
      },

      {
        name: "Business Intelligence (BI) Analyst",
        description:
          "Business Intelligence Analysts utilize data analysis tools to support decision-making within an organization. They transform data into actionable insights through reporting and visualization, helping businesses understand trends and make informed decisions. This role requires strong analytical skills, proficiency in SQL, and experience with dashboarding tools.",
        requiredSkills: [
          "Data Analytics",
          "SQL",
          "Dashboarding Tools",
          "Data Warehousing",
          "ETL Processes",
          "Statistical Analysis",
          "Data Governance",
          "Business Acumen",
        ],
      },

      {
        name: "Database Administrator",
        description:
          "Database Administrators are responsible for managing and maintaining database systems to ensure optimal performance, security, and availability of data. They handle tasks such as database design, backup and recovery, and performance tuning, ensuring that data is stored securely and can be accessed efficiently. This role requires strong technical skills in SQL and database management systems, along with problem-solving abilities.",
        requiredSkills: [
          "SQL",
          "Database Design",
          "Backup and Recovery",
          "Performance Tuning",
          "Replication",
          "Data Modeling",
          "Security Management",
          "Troubleshooting",
        ],
      },

      {
        name: "IT Project Manager",
        description:
          "IT Project Managers oversee technology projects from inception to completion, ensuring they are delivered on time, within scope, and within budget. They coordinate teams, manage resources, and communicate with stakeholders to ensure project success. This role requires strong project management skills, risk management abilities, and leadership qualities.",
        requiredSkills: [
          "Project Management",
          "Risk Management",
          "Budgeting",
          "Agile/Scrum",
          "Team Leadership",
          "Stakeholder Communication",
          "Resource Management",
          "Quality Assurance",
        ],
      },

      {
        name: "Cloud Architect",
        description:
          "Cloud Architects design cloud infrastructure and services for businesses, ensuring scalability, security, and cost-effectiveness in cloud solutions. They work with various cloud platforms to create architectures that meet business needs and optimize performance. This role requires expertise in cloud technologies, architecture design, and a strong understanding of security and compliance.",
        requiredSkills: [
          "Cloud Platforms (AWS/Azure/GCP)",
          "Architecture Design",
          "Security",
          "Cost Optimization",
          "DevOps Practices",
          "Networking",
          "Disaster Recovery",
          "Compliance",
        ],
      },
    ],
  },
  {
    specialization: "Computer Networks",
    careers: [
      {
        name: "Network Administrator",
        description:
          "Network Administrators manage and maintain computer networks and related computing environments, ensuring network availability and performance. They handle tasks such as network configuration, monitoring, and troubleshooting, ensuring that all network components function optimally. This role requires strong technical skills in networking protocols and systems, along with problem-solving abilities.",
        requiredSkills: [
          "Networking Protocols",
          "Firewall Management",
          "Troubleshooting",
          "TCP/IP",
          "VPN",
          "Network Monitoring",
          "Configuration Management",
          "Documentation",
        ],
      },

      {
        name: "Network Security Specialist",
        description:
          "Network Security Specialists ensure the security and integrity of an organization’s network by implementing security measures and monitoring for potential threats. They are responsible for configuring firewalls, conducting vulnerability assessments, and responding to security incidents. This role requires a strong understanding of cybersecurity principles, risk assessment, and incident response strategies.",
        requiredSkills: [
          "Cybersecurity",
          "Encryption Methods",
          "Incident Response",
          "Firewall Configuration",
          "Ethical Hacking",
          "Network Forensics",
          "Risk Assessment",
          "Security Policies",
        ],
      },

      {
        name: "Cloud Network Engineer",
        description:
          "Cloud Network Engineers design and manage cloud-based network solutions, ensuring scalability and security in cloud environments. They work with cloud service providers to implement networking solutions that meet business requirements and optimize performance. This role requires expertise in cloud networking technologies, automation, and security best practices.",
        requiredSkills: [
          "Cloud Networking",
          "AWS/Azure/GCP",
          "Automation",
          "Cloud Security",
          "SD-WAN",
          "Network Architecture",
          "Load Balancing",
          "Monitoring",
        ],
      },

      {
        name: "VoIP Engineer",
        description:
          "VoIP Engineers specialize in the installation and maintenance of Voice over IP (VoIP) systems, ensuring high-quality voice communication over networks. They configure VoIP systems, troubleshoot issues, and optimize performance to provide reliable communication solutions. This role requires knowledge of SIP protocols, network configuration, and unified communications.",
        requiredSkills: [
          "SIP Protocols",
          "Network Configuration",
          "Unified Communications",
          "VoIP Security",
          "Call Routing",
          "Quality of Service (QoS)",
          "Troubleshooting",
          "System Integration",
        ],
      },

      {
        name: "Network Operations Center (NOC) Engineer",
        description:
          "NOC Engineers monitor and support networks to ensure their reliability and uptime. They respond to incidents, perform maintenance tasks, and ensure that network performance meets organizational standards. This role requires strong technical skills in network monitoring tools, incident management, and effective communication.",
        requiredSkills: [
          "Network Monitoring Tools",
          "Incident Management",
          "Troubleshooting",
          "TCP/IP",
          "Documentation",
          "Communication Skills",
          "Problem Solving",
          "Team Collaboration",
        ],
      },
    ],
  },
  {
    specialization: "Computer Science",
    careers: [
      {
        name: "Software Engineer",
        description:
          "Software Engineers develop, test, and maintain software applications, often collaborating with cross-functional teams to deliver high-quality software solutions. They are involved in the entire software development lifecycle, from requirements gathering to deployment and maintenance. This role requires strong programming skills, problem-solving abilities, and a solid understanding of software design principles and methodologies.",
        requiredSkills: [
          "Programming",
          "Problem Solving",
          "Version Control",
          "Data Structures",
          "Algorithms",
          "Software Development Life Cycle (SDLC)",
          "Testing",
          "Debugging",
        ],
      },

      {
        name: "Data Scientist",
        description:
          "Data Scientists analyze and interpret complex data to help organizations make informed decisions. They utilize statistical methods and machine learning techniques to extract insights from data, often working with large datasets and employing data visualization tools to communicate findings. This role requires a strong foundation in statistics, programming, and data analysis, along with excellent communication skills.",
        requiredSkills: [
          "Statistics",
          "Machine Learning",
          "Data Visualization",
          "Python/R",
          "Big Data",
          "Data Cleaning",
          "Feature Engineering",
          "Communication Skills",
        ],
      },

      {
        name: "Cybersecurity Analyst",
        description:
          "Cybersecurity Analysts monitor and protect computer systems and networks from security breaches. They implement security measures, conduct vulnerability assessments, and respond to incidents to safeguard sensitive information. This role requires a strong understanding of cybersecurity principles, threat detection, and incident response strategies, along with excellent analytical skills.",
        requiredSkills: [
          "Threat Detection",
          "Penetration Testing",
          "SIEM Tools",
          "Incident Response",
          "Malware Analysis",
          "Risk Assessment",
          "Security Policies",
          "Communication Skills",
        ],
      },

      {
        name: "Game Developer",
        description:
          "Game Developers create and develop video games for various platforms, focusing on gameplay mechanics, graphics, and user experience. They work with game engines and programming languages to design and implement game features, often collaborating with artists and designers. This role requires creativity, strong programming skills, and a solid understanding of game design principles.",
        requiredSkills: [
          "C#",
          "Unity/Unreal Engine",
          "Game Design",
          "3D Modeling",
          "Animation",
          "Problem Solving",
          "Creativity",
          "Team Collaboration",
        ],
      },

      {
        name: "Cloud Software Engineer",
        description:
          "Cloud Software Engineers design and develop software specifically for cloud platforms, focusing on scalability, reliability, and performance. They work with cloud services to create applications that leverage cloud computing capabilities, ensuring that software solutions are optimized for cloud environments. This role requires knowledge of cloud architecture, microservices, and API development, along with strong programming skills.",
        requiredSkills: [
          "AWS/Azure/GCP",
          "Cloud Development",
          "Microservices",
          "Serverless Architecture",
          "API Development",
          "DevOps Practices",
          "Security",
          "Collaboration",
        ],
      },
    ],
  },
];

app.get("/explore-career-options", (req, res) => {
  const { specialization } = req.query;
  const result = careerData.find(
    (item) => item.specialization === specialization
  );
  if (result) {
    res.json(result.careers);
  } else {
    res.status(404).json({ message: "Specialization not found" });
  }
});

app.get("/get-specializations", (req, res) => {
  const specializations = careerData.map((item) => item.specialization);
  if (specializations.length > 0) {
    res.json(specializations);
  } else {
    res.status(404).json({ message: "No specializations found" });
  }
});

//--------------------------nader----------------------------------
const axios = require("axios");

app.get("/get-courses", async (req, res) => {
  const { query } = req.query; // Extract search query from request
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  async function getCourseraCourses(query) {
    try {
      // Fetch courses from Coursera API
      const response = await axios.get(
        `https://api.coursera.org/api/courses.v1?q=search&query=${query}&includes=instructorIds,partnerIds&fields=name,description,photoUrl`
      );

      // Process Coursera response to extract relevant course data
      return response.data.elements.map((course) => ({
        title: course.name,
        description: course.description || "No description available",
        platform: "Coursera",
        url: `https://www.coursera.org/learn/${course.slug}`,
        image: course.photoUrl || "No image available",
      }));
    } catch (error) {
      console.error("Error fetching courses from Coursera:", error.message);
      return []; // Return an empty array on failure
    }
  }

  try {
    const courseraCourses = await getCourseraCourses(query);

    // Return the Coursera courses as JSON response
    res.json(courseraCourses);
  } catch (error) {
    console.error("Error fetching courses:", error.message);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
