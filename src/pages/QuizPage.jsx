import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import quizQuestions from '../data/quizQuestions.json';

// Helper function to determine button classes and avoid nested ternaries
const getButtonClasses = (
  showFeedback,
  option,
  correctAnswer,
  selectedAnswer
) => {
  if (showFeedback) {
    if (option === correctAnswer) {
      return 'bg-green-100 dark:bg-green-800 border-green-500 dark:border-green-600 text-green-700 dark:text-green-200 ring-green-500';
    }
    if (selectedAnswer === option) {
      return 'bg-red-100 dark:bg-red-800 border-red-500 dark:border-red-600 text-red-700 dark:text-red-200 ring-red-500';
    }
    return 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 opacity-80';
  }
  return 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 focus:ring-blue-500';
};

export default function QuizPage() {
  const { t } = useTranslation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const nextQuestionButtonRef = useRef(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = React.useMemo(
    // eslint-disable-next-line security/detect-object-injection
    () => quizQuestions[currentQuestionIndex],
    [currentQuestionIndex]
  );

  const handleAnswerSelect = (option) => {
    if (showFeedback) return;

    setSelectedAnswer(option);
    setShowFeedback(true);
    if (option === currentQuestion.correctAnswer) {
      setIsCorrect(true);
      setScore((prevScore) => prevScore + 1);
    } else {
      setIsCorrect(false);
    }
  };

  useEffect(() => {
    if (showFeedback && nextQuestionButtonRef.current) {
      nextQuestionButtonRef.current.focus();
    }
  }, [showFeedback]);

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowFeedback(false);
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setQuizCompleted(true);
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
      <div className='p-4 md:p-6 max-w-2xl mx-auto'>
        <div className='bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 text-center'>
          <h2 className='text-3xl font-bold text-gray-800 dark:text-white mb-4'>
            {t('quizCompleted')}
          </h2>
          <p className='text-xl text-gray-700 dark:text-gray-300 mb-6'>
            {t('quizScore', {
              score: score,
              totalQuestions: quizQuestions.length,
            })}
          </p>
          <button
            onClick={handleRestartQuiz}
            className='px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow
                       focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
          >
            {t('restartQuiz')}
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className='p-6 max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg'>
        <p className='text-xl text-gray-700 dark:text-gray-200'>
          {quizQuestions.length === 0 ? t('noQuizQuestions') : t('loadingQuiz')}
        </p>
      </div>
    );
  }

  return (
    <div className='p-4 md:p-6 max-w-2xl mx-auto'>
      <div className='bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6'>
        <div className='mb-4'>
          <div className='flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1'>
            <span>
              {t('questionOutOf', {
                current: currentQuestionIndex + 1,
                total: quizQuestions.length,
              })}
            </span>
            <span>{t('scoreLabel', { score: score })}</span>
          </div>
          <div
            className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5'
            role='progressbar'
            aria-valuemin='0'
            aria-valuemax={quizQuestions.length}
            aria-valuenow={currentQuestionIndex + 1}
            aria-valuetext={t('questionOutOf', {
              current: currentQuestionIndex + 1,
              total: quizQuestions.length,
            })}
            aria-label={t('quizProgress')}
          >
            <div
              className='bg-blue-600 h-2.5 rounded-full'
              style={{
                width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        <div className='mb-6'>
          <p className='text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1'>
            {currentQuestion.id}. {currentQuestion.questionText}
          </p>
          {currentQuestion.sqlQuery && (
            <pre className='bg-gray-100 dark:bg-gray-900 p-3 rounded-md text-sm text-gray-700 dark:text-gray-200 overflow-x-auto my-4 border border-gray-300 dark:border-gray-600'>
              <code>{currentQuestion.sqlQuery}</code>
            </pre>
          )}
        </div>

        <div className='space-y-3 mb-6'>
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              disabled={showFeedback}
              className={`w-full text-left p-4 rounded-lg border
                          transition-all duration-150 ease-in-out
                          focus:outline-none focus:ring-2 focus:ring-opacity-50
                          disabled:cursor-not-allowed
                          ${getButtonClasses(showFeedback, option, currentQuestion.correctAnswer, selectedAnswer)}
                        `}
            >
              {option}
            </button>
          ))}
        </div>

        {showFeedback && (
          <div
            className={`p-3 rounded-md mb-4 text-sm font-medium ${isCorrect ? 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200' : 'bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200'}`}
            aria-live='polite'
          >
            {isCorrect
              ? t('correctExclamation')
              : t('incorrectFeedback', {
                  correctAnswer: currentQuestion.correctAnswer,
                })}
          </div>
        )}

        <button
          ref={nextQuestionButtonRef}
          onClick={handleNextQuestion}
          disabled={!showFeedback}
          className='w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                     disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-opacity'
        >
          {currentQuestionIndex === quizQuestions.length - 1
            ? t('showResults')
            : t('nextQuestion')}
        </button>
      </div>
    </div>
  );
}
