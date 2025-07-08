import React, { useState, useEffect } from 'react';
import quizQuestions from '../data/quizQuestions.json';

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false); // New state for quiz completion

  // Memoize currentQuestion to avoid re-calculating on every render unless currentQuestionIndex changes
  const currentQuestion = React.useMemo(() => quizQuestions[currentQuestionIndex], [currentQuestionIndex]);

  // Function to handle answer selection
  const handleAnswerSelect = (option) => {
    if (showFeedback) return; // Prevent changing answer after feedback is shown

    setSelectedAnswer(option);
    setShowFeedback(true);
    if (option === currentQuestion.correctAnswer) {
      setIsCorrect(true);
      setScore(prevScore => prevScore + 1);
    } else {
      setIsCorrect(false);
    }
  };

  // Function to move to the next question
  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowFeedback(false);
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setQuizCompleted(true); // Set quiz as completed
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setShowFeedback(false);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Quiz Completed!</h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
            You scored {score} out of {quizQuestions.length}.
          </p>
          <button
            onClick={handleRestartQuiz}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow
                       focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    // This case should ideally not be reached if quizCompleted handles the end state.
    // It's a fallback or for initial loading if quizQuestions is empty.
    return (
      <div className="p-6 max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <p className="text-xl text-gray-700 dark:text-gray-200">
          {quizQuestions.length === 0 ? "No quiz questions available." : "Loading quiz..."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6">
        {/* Progress Bar (Optional but good for UX) */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
            <span>Score: {score}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-6">
          {/*<h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
             Question {currentQuestionIndex + 1} of {quizQuestions.length} // Moved to progress bar area
          </h2>*/}
          <p className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1">
            {currentQuestion.id}. {currentQuestion.questionText}
          </p>
          {currentQuestion.sqlQuery && (
            <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md text-sm text-gray-700 dark:text-gray-200 overflow-x-auto my-4 border border-gray-300 dark:border-gray-600">
              <code>{currentQuestion.sqlQuery}</code>
            </pre>
          )}
        </div>

        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              disabled={showFeedback}
              className={`w-full text-left p-4 rounded-lg border
                          transition-all duration-150 ease-in-out
                          focus:outline-none focus:ring-2 focus:ring-opacity-50
                          disabled:cursor-not-allowed
                          ${ showFeedback ?
                              (option === currentQuestion.correctAnswer ?
                                'bg-green-100 dark:bg-green-800 border-green-500 dark:border-green-600 text-green-700 dark:text-green-200 ring-green-500' :
                                (selectedAnswer === option ?
                                  'bg-red-100 dark:bg-red-800 border-red-500 dark:border-red-600 text-red-700 dark:text-red-200 ring-red-500' :
                                  'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 opacity-80')) :
                              'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 focus:ring-blue-500'
                          }
                        `}
            >
              {option}
            </button>
          ))}
        </div>

        {showFeedback && (
          <div className={`p-3 rounded-md mb-4 text-sm font-medium ${isCorrect ? 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200' : 'bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200'}`}>
            {isCorrect ? "🎉 Correct!" : `🤔 Incorrect. The correct answer is: ${currentQuestion.correctAnswer}`}
          </div>
        )}

        <button
          onClick={handleNextQuestion}
          disabled={!showFeedback}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                     disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-opacity"
        >
          {currentQuestionIndex === quizQuestions.length - 1 ? "Show Results" : "Next Question"}
        </button>
      </div>
    </div>
  );
}
