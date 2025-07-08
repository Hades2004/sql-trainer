import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

// This will be mutated by test suites/setups
let currentQuizData = [];

const mockQuizDataRegular = [
  {
    id: 1,
    questionText: "What is SQL?",
    sqlQuery: "SELECT 'Structured Query Language';",
    options: ["Style Query Language", "Structured Query Language", "Simple Query Language", "Sequential Query Language"],
    correctAnswer: "Structured Query Language"
  },
  {
    id: 2,
    questionText: "Which SQL keyword is used to retrieve data?",
    options: ["GET", "SELECT", "RETRIEVE", "OPEN"],
    correctAnswer: "SELECT"
  },
  {
    id: 3,
    questionText: "What does 'WHERE' clause do?",
    options: ["Sorts results", "Filters records", "Groups records", "Joins tables"],
    correctAnswer: "Filters records"
  }
];

// Top-level mock using a getter to access the mutable currentQuizData
vi.mock('../data/quizQuestions.json', () => ({
  get default() {
    return currentQuizData;
  }
}));

describe('QuizPage Component', () => {
  let QuizPage; // To hold the dynamically imported module

  beforeEach(async () => {
    currentQuizData = JSON.parse(JSON.stringify(mockQuizDataRegular));
    vi.resetModules(); // Crucial: Clears module cache
    // Dynamically import QuizPage AFTER resetting modules and setting currentQuizData
    QuizPage = (await import('./QuizPage.jsx')).default;
  });

  afterEach(() => {
    // Optional: Clean up mocks or reset state if necessary,
    // though vi.resetModules() in beforeEach handles module state.
    // vi.clearAllMocks(); // if using vi.fn() spies that need resetting
  });

  it('renders the first question correctly', () => {
    render(<QuizPage />);
    expect(screen.getByText(currentQuizData[0].questionText)).toBeInTheDocument();
    expect(screen.getByText(`Question 1 of ${currentQuizData.length}`)).toBeInTheDocument();
    currentQuizData[0].options.forEach(option => {
      expect(screen.getByRole('button', { name: option })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: "Next Question" })).toBeDisabled();
  });

  it('allows selecting an answer and shows feedback (correct answer)', async () => {
    render(<QuizPage />);
    const correctAnswerOption = screen.getByRole('button', { name: currentQuizData[0].correctAnswer });

    await act(async () => {
      await userEvent.click(correctAnswerOption);
    });

    expect(screen.getByText("🎉 Correct!")).toBeInTheDocument();
    expect(screen.getByText(`Score: 1`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Next Question" })).toBeEnabled();
    currentQuizData[0].options.forEach(option => {
      expect(screen.getByRole('button', { name: option })).toBeDisabled();
    });
  });

  it('allows selecting an answer and shows feedback (incorrect answer)', async () => {
    render(<QuizPage />);
    const incorrectOptionText = currentQuizData[0].options.find(opt => opt !== currentQuizData[0].correctAnswer);
    const incorrectAnswerOption = screen.getByRole('button', { name: incorrectOptionText });

    await act(async () => {
      await userEvent.click(incorrectAnswerOption);
    });

    expect(screen.getByText(`🤔 Incorrect. The correct answer is: ${currentQuizData[0].correctAnswer}`)).toBeInTheDocument();
    expect(screen.getByText(`Score: 0`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Next Question" })).toBeEnabled();
  });

  it('navigates to the next question', async () => {
    render(<QuizPage />);
    const firstAnswerOption = screen.getByRole('button', { name: currentQuizData[0].options[0] });
    await act(async () => {
      await userEvent.click(firstAnswerOption);
    });

    const nextButton = screen.getByRole('button', { name: "Next Question" });
    await act(async () => {
      await userEvent.click(nextButton);
    });

    expect(screen.getByText(currentQuizData[1].questionText)).toBeInTheDocument();
    expect(screen.getByText(`Question 2 of ${currentQuizData.length}`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Next Question" })).toBeDisabled();
  });

  it('completes the quiz and shows results', async () => {
    render(<QuizPage />);
    for (let i = 0; i < currentQuizData.length; i++) {
      const question = currentQuizData[i];
      const answerOption = await screen.findByRole('button', { name: question.options[0] });
      await act(async () => {
         await userEvent.click(answerOption);
      });

      const nextButtonText = i === currentQuizData.length - 1 ? "Show Results" : "Next Question";
      const nextButton = await screen.findByRole('button', { name: nextButtonText });
      await act(async () => {
        await userEvent.click(nextButton);
      });
    }

    expect(screen.getByText("Quiz Completed!")).toBeInTheDocument();
    const expectedScore = 1;
    expect(screen.getByText(`You scored ${expectedScore} out of ${currentQuizData.length}.`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Restart Quiz" })).toBeInTheDocument();
  });

  it('restarts the quiz', async () => {
    render(<QuizPage />);
    for (let i = 0; i < currentQuizData.length; i++) {
      const answerOption = await screen.findByRole('button', { name: currentQuizData[i].options[0] });
       await act(async () => {
        await userEvent.click(answerOption);
      });
      const nextButtonText = i === currentQuizData.length - 1 ? "Show Results" : "Next Question";
      const nextButton = await screen.findByRole('button', { name: nextButtonText });
      await act(async () => {
        await userEvent.click(nextButton);
      });
    }

    const restartButton = screen.getByRole('button', { name: "Restart Quiz" });
    await act(async () => {
      await userEvent.click(restartButton);
    });

    expect(screen.getByText(currentQuizData[0].questionText)).toBeInTheDocument();
    expect(screen.getByText(`Question 1 of ${currentQuizData.length}`)).toBeInTheDocument();
    expect(screen.getByText("Score: 0")).toBeInTheDocument();
  });

  it('displays SQL query if present in question data', () => {
    render(<QuizPage />);
    expect(screen.getByText(currentQuizData[0].sqlQuery)).toBeInTheDocument();
  });

  it('does not display SQL query area if not present in question data', async () => {
    render(<QuizPage />);
    const firstAnswerOption = screen.getByRole('button', { name: currentQuizData[0].options[0] });
    await act(async () => {
      await userEvent.click(firstAnswerOption);
    });
    const nextButton = screen.getByRole('button', { name: "Next Question" });
    await act(async () => {
      await userEvent.click(nextButton);
    });
    expect(screen.getByText(currentQuizData[1].questionText)).toBeInTheDocument();
    expect(screen.queryByText(currentQuizData[0].sqlQuery)).not.toBeInTheDocument();
  });
});

describe('QuizPage Component - Empty Quiz Data', () => {
  let QuizPageEmpty;

  beforeAll(async () => {
    currentQuizData = [];
    vi.resetModules();
    QuizPageEmpty = (await import('./QuizPage.jsx')).default;
  });

  afterAll(() => {
    // Reset to a default state for other potential suites in the file or other files
    currentQuizData = JSON.parse(JSON.stringify(mockQuizDataRegular));
    vi.resetModules();
  });

  it('handles empty quizQuestions.json gracefully', () => {
    render(<QuizPageEmpty />);
    expect(screen.getByText("No quiz questions available.")).toBeInTheDocument();
  });
});
