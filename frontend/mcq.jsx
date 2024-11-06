import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
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

  const gradeQuestions = [
    { question: "What is your grade in module M1?", options: ["A", "B", "C", "D"] },
    { question: "What is your grade in module M2?", options: ["A", "B", "C", "D"] },
    { question: "What is your grade in module M3?", options: ["A", "B", "C", "D"] },
    { question: "What is your grade in module M4?", options: ["A", "B", "C", "D"] },
    { question: "What is your grade in module M5?", options: ["A", "B", "C", "D"] },
    { question: "What is your grade in module M6?", options: ["A", "B", "C", "D"] },
    { question: "What is your grade in module M7?", options: ["A", "B", "C", "D"] },
    { question: "What is your grade in module M8?", options: ["A", "B", "C", "D"] },
    { question: "What is your grade in module M9?", options: ["A", "B", "C", "D"] },
    { question: "What is your grade in module M10?", options: ["A", "B", "C", "D"] },
  ];

  const mcqQuestions = [
    { question: "What is the primary focus of your studies?", options: ["Computer Science", "Engineering", "Business", "Arts"] },
    { question: "Which area interests you the most?", options: ["Data Analysis", "Software Development", "Network Security", "User Interface Design"] },
    { question: "What type of projects do you enjoy working on?", options: ["Research-oriented", "Product Development", "System Administration", "Creative Design"] },
    { question: "Which skill do you want to improve the most?", options: ["Programming", "Problem-solving", "Communication", "Project Management"] },
    { question: "What kind of work environment do you prefer?", options: ["Corporate", "Startup", "Academia", "Freelance"] },
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