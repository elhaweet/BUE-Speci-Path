import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './mcq-styles.css'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

const PieChartComponent = ({ data }) => {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(4))
  }));

  return (
    <div className="pie-chart-container">
      <h3>Specialization Score Distribution</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${(value * 100).toFixed(2)}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const IntroScreen = ({ onComplete }) => {
  const messages = ["Welcome to the Specialization Recommender", "Answer a few questions about your interests and grades", "Let's get started!"];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (currentMessageIndex < messages.length) {
      if (displayedText.length < messages[currentMessageIndex].length) {
        const timeoutId = setTimeout(() => {
          setDisplayedText(messages[currentMessageIndex].slice(0, displayedText.length + 1));
        }, 50);
        return () => clearTimeout(timeoutId);
      } else {
        const timeoutId = setTimeout(() => {
          if (currentMessageIndex < messages.length - 1) {
            setCurrentMessageIndex(currentMessageIndex + 1);  
            setDisplayedText('');
          } else {
            onComplete();
          }
        }, 1000);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [currentMessageIndex, displayedText, messages, onComplete]);

  return (
    <div className="intro-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMessageIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="intro-message"
        >
          {displayedText}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const MCQComponent = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [detailedGrade, setDetailedGrade] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [mcqAnswers, setMcqAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [specializationScores, setSpecializationScores] = useState(null);
  const [showExploreCareer, setShowExploreCareer] = useState(false);

  const gradeQuestions = [
    { question: "What is your grade in module Information Systems?", options: ["A", "B", "C", "D"] },
    { question: "What is your grade in module Introduction to Computing?", options: ["A", "B", "C", "D"] },
    { question: "What is your grade in module Math 1?", options: ["A", "B", "C", "D"] },
    { question: "What is your grade in module Math 2?", options: ["A", "B", "C", "D"] },
    { question: "What is your grade in module Introduction to Web Programming?", options: ["A", "B", "C", "D"] },
    { question: "What is your grade in module Software Engineering 1?", options: ["A", "B", "C", "D"] },
    { question: "What is your grade in module Programming in Java?", options: ["A", "B", "C", "D"] },
    { question: "What is your grade in module Probability and Statistics?", options: ["A", "B", "C", "D"] },
    { question: "What is your grade in module Introduction to Networking?", options: ["A", "B", "C", "D"] },
    { question: "What is your grade in module Operating Systems?", options: ["A", "B", "C", "D"] },
  ];

  const mcqQuestions = [
    {
      question: "How much do you enjoy solving complex problems using patterns and logic?",
      options: [
        "I love it and excel at it", // AI: 1, SE: 0.7, CN: 0.5, IS: 0.6, CS: 0.8
        "I find it intriguing but challenging", // AI: 0.7, SE: 0.5, CN: 0.4, IS: 0.5, CS: 0.6
        "I prefer straightforward tasks", // AI: 0.4, SE: 0.3, CN: 0.3, IS: 0.4, CS: 0.5
        "I don't enjoy this type of work" // AI: 0, SE: 0.1, CN: 0.1, IS: 0.2, CS: 0.3
      ]
    },
    {
      question: "How do you feel about designing and building solutions for real-world challenges?",
      options: [
        "I enjoy creating and refining software systems", // AI: 0.7, SE: 1, CN: 0.6, IS: 0.5, CS: 0.8
        "I like the idea but prefer collaborative roles", // AI: 0.5, SE: 0.8, CN: 0.5, IS: 0.6, CS: 0.7
        "I would rather analyze systems than build them", // AI: 0.4, SE: 0.5, CN: 0.4, IS: 0.7, CS: 0.6
        "I am not interested in developing solutions" // AI: 0.2, SE: 0.3, CN: 0.3, IS: 0.5, CS: 0.4
      ]
    },
    {
      question: "How interested are you in connecting systems and ensuring seamless communication?",
      options: [
        "I’m fascinated by it and enjoy learning about it", // AI: 0.6, SE: 0.7, CN: 1, IS: 0.5, CS: 0.8
        "I find it interesting but not my primary focus", // AI: 0.5, SE: 0.6, CN: 0.7, IS: 0.6, CS: 0.7
        "I understand its importance but prefer other topics", // AI: 0.3, SE: 0.5, CN: 0.4, IS: 0.5, CS: 0.6
        "I don't find this area appealing" // AI: 0.1, SE: 0.3, CN: 0.2, IS: 0.3, CS: 0.4
      ]
    },
    {
      question: "How comfortable are you with managing and interpreting data for decision-making?",
      options: [
        "I enjoy organizing and analyzing data", // AI: 0.7, SE: 0.6, CN: 0.5, IS: 1, CS: 0.8
        "I like analyzing data but not managing systems", // AI: 0.6, SE: 0.5, CN: 0.4, IS: 0.8, CS: 0.7
        "I prefer using data than handling its systems", // AI: 0.4, SE: 0.4, CN: 0.3, IS: 0.6, CS: 0.6
        "I’m not comfortable with data management" // AI: 0.2, SE: 0.3, CN: 0.2, IS: 0.4, CS: 0.5
      ]
    },
    {
      question: "How excited are you about exploring the foundations and theory behind computing?",
      options: [
        "I love diving deep into theoretical concepts", // AI: 0.8, SE: 0.6, CN: 0.7, IS: 0.5, CS: 1
        "I enjoy it but focus more on practical applications", // AI: 0.7, SE: 0.8, CN: 0.6, IS: 0.6, CS: 0.8
        "I prefer applying concepts over understanding theory", // AI: 0.5, SE: 0.7, CN: 0.5, IS: 0.6, CS: 0.6
        "I don't enjoy theoretical aspects of computing" // AI: 0.3, SE: 0.5, CN: 0.3, IS: 0.4, CS: 0.4
      ]
    }
  ];
  

  const allQuestions = [
    ...gradeQuestions.slice(0, 3),
    mcqQuestions[0],
    ...gradeQuestions.slice(3, 5),
    mcqQuestions[1],
    ...gradeQuestions.slice(5, 7),
    mcqQuestions[2],
    gradeQuestions[7],
    mcqQuestions[3],
    gradeQuestions[8],
    mcqQuestions[4],
    gradeQuestions[9]
  ];

  const gradeDetails = {
    "A": ["A+", "A", "A-"],
    "B": ["B+", "B", "B-"],
    "C": ["C+", "C", "C-"],
    "D": ["D+", "D", "D-"]
  };

  const handleAnswerSelect = (index) => {
    if (selectedAnswer === index) {
      setSelectedAnswer(null);
      setDetailedGrade(null);
    } else {
      setSelectedAnswer(index);
      setDetailedGrade(null);
    }
  };

  const handleDetailedGradeSelect = (grade) => {
    setDetailedGrade(grade);
  };

  const handleNextQuestion = () => {
    if (allQuestions[currentQuestion].options.length === 4 && !gradeDetails[allQuestions[currentQuestion].options[0]]) {
      // MCQ question
      setMcqAnswers(prevAnswers => ({
        ...prevAnswers,
        [`Q${Object.keys(mcqAnswers).length + 1}`]: selectedAnswer
      }));
    } else if (detailedGrade !== null) {
      // Grade question
      setUserAnswers(prevAnswers => ({
        ...prevAnswers,
        [`M${Object.keys(userAnswers).length + 1}`]: detailedGrade
      }));
    }

    if (currentQuestion < allQuestions.length - 1) {
      setCurrentQuestion(prevQuestion => prevQuestion + 1);
      setSelectedAnswer(null);
      setDetailedGrade(null);
    } else {
      setIsFinished(true);
    }
  };

  useEffect(() => {
    if (isFinished) {
      getRecommendation();
    }
  }, [isFinished]);

  useEffect(() => {
    console.log("Current question:", currentQuestion);
    console.log("Selected answer:", selectedAnswer);
    console.log("Detailed grade:", detailedGrade);
  }, [currentQuestion, selectedAnswer, detailedGrade]);

  const getRecommendation = async () => {
    try {
      const response = await axios.post('http://localhost:5000/recommend-specialization', {
        grades: userAnswers,
        mcqResponses: mcqAnswers
      });
      setRecommendation(response.data.recommendation);
      setSpecializationScores(response.data.scores);
    } catch (error) {
      console.error('Error calculating recommendation:', error);
    }
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const renderQuestion = () => {
    const question = allQuestions[currentQuestion];
    if (question.options.length === 4 && !gradeDetails[question.options[0]]) {
      // Render MCQ question
      return (
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="question-container mcq-question"
        >
          <h2>{question.question}</h2>
          <div className="mcq-options-container">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mcq-option ${selectedAnswer === index ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(index)}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      );
    } else {
      // Render grade question
      return (
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="question-container grade-question"
        >
          <h2>{question.question}</h2>
          <div className="options-container">
            {question.options.map((option, index) => (
              <motion.div
                key={index}
                className={`option-wrapper ${selectedAnswer === index ? 'selected' : ''}`}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="option"
                  onClick={() => handleAnswerSelect(index)}
                >
                  {option}
                </motion.button>
                {selectedAnswer === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="detailed-grade-list"
                  >
                    {gradeDetails[option].map((grade, gradeIndex) => (
                      <motion.button
                        key={gradeIndex}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`detailed-grade ${detailedGrade === grade ? 'selected' : ''}`}
                        onClick={() => handleDetailedGradeSelect(grade)}
                      >
                        {grade}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      );
    }
  };

  return (
    <div className="page-container">
      <div className="dynamic-background">
        <div className="background-shape shape1"></div>
        <div className="background-shape shape2"></div>
        <div className="background-shape shape3"></div>
      </div>
      {showIntro ? (
        <IntroScreen onComplete={handleIntroComplete} />
      ) : (
        <div className="mcq-container">
          <div className="logo-container">
            <div className="logo"></div>
          </div>
          <h1 className="university-name">The British University In Egypt</h1>
          <AnimatePresence mode="wait">
            {!isFinished ? (
              renderQuestion()
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="result-container"
              >
                <h2>Your Recommended Specialization</h2>
                {recommendation ? (
                  <>
                    <p className="recommendation">{recommendation}</p>
                    <PieChartComponent data={specializationScores} />
                  </>
                ) : (
                  <p>Calculating recommendation...</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          {!isFinished && (
            <button 
              className="next-button" 
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null && detailedGrade === null}
            >
              {currentQuestion < allQuestions.length - 1 ? 'Next Question' : 'Finish'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const App = () => (
  <ErrorBoundary>
    <MCQComponent /> 
  </ErrorBoundary>
);

export default App;