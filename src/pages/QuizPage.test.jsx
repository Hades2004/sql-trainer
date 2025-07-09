import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

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

describe('QuizPage Component with Regular Data', () => {
  let QuizPage;

  beforeAll(async () => {
    vi.doMock('../data/quizQuestions.json', () => ({
      default: mockQuizDataRegular
    }));
    QuizPage = (await import('./QuizPage.jsx')).default;
  });

  afterAll(() => {
    vi.unmock('../data/quizQuestions.json');
    vi.resetModules();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the first question correctly', () => {
    render(<QuizPage />);
    const firstQuestion = mockQuizDataRegular[0];
    expect(screen.getByText(`${firstQuestion.id}. ${firstQuestion.questionText}`)).toBeInTheDocument();
    expect(screen.getByText(`Question ${1} of ${mockQuizDataRegular.length}`)).toBeInTheDocument();
    mockQuizDataRegular[0].options.forEach(option => {
      expect(screen.getByRole('button', { name: option })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /Next Question/i })).toBeDisabled();
  });

  it('allows selecting an answer and shows feedback (correct answer)', async () => {
    render(<QuizPage />);
    const firstQuestion = mockQuizDataRegular[0];
    const correctAnswerOption = screen.getByRole('button', { name: firstQuestion.correctAnswer });

    await act(async () => {
      await userEvent.click(correctAnswerOption);
    });

    expect(screen.getByText(/🎉 Correct!/i)).toBeInTheDocument();
    expect(screen.getByText(`Score: 1`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Next Question/i })).toBeEnabled();
    firstQuestion.options.forEach(option => {
      expect(screen.getByRole('button', { name: option })).toBeDisabled();
    });
  });

  it('allows selecting an answer and shows feedback (incorrect answer)', async () => {
    render(<QuizPage />);
    const firstQuestion = mockQuizDataRegular[0];
    const incorrectOptionText = firstQuestion.options.find(opt => opt !== firstQuestion.correctAnswer);
    const incorrectAnswerOption = screen.getByRole('button', { name: incorrectOptionText });

    await act(async () => {
      await userEvent.click(incorrectAnswerOption);
    });

    expect(screen.getByText(`🤔 Incorrect. The correct answer is: ${firstQuestion.correctAnswer}`)).toBeInTheDocument();
    expect(screen.getByText(`Score: 0`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Next Question/i })).toBeEnabled();
  });

  it('navigates to the next question', async () => {
    render(<QuizPage />);
    const firstQuestion = mockQuizDataRegular[0];
    const secondQuestion = mockQuizDataRegular[1];
    const firstAnswerOption = screen.getByRole('button', { name: firstQuestion.options[0] });
    await act(async () => {
      await userEvent.click(firstAnswerOption);
    });

    const nextButton = screen.getByRole('button', { name: /Next Question/i });
    await act(async () => {
      await userEvent.click(nextButton);
    });

    expect(screen.getByText(`${secondQuestion.id}. ${secondQuestion.questionText}`)).toBeInTheDocument();
    expect(screen.getByText(`Question ${2} of ${mockQuizDataRegular.length}`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Next Question/i })).toBeDisabled();
  });

  it('completes the quiz and shows results', async () => {
    render(<QuizPage />);
    for (let i = 0; i < mockQuizDataRegular.length; i++) {
      const question = mockQuizDataRegular[i];
      const answerOptionText = question.options[0]; // Always pick the first option

      const answerOption = await screen.findByRole('button', { name: answerOptionText });
      await act(async () => {
         await userEvent.click(answerOption);
      });

      const nextButtonText = i === mockQuizDataRegular.length - 1 ? /Show Results/i : /Next Question/i;
      const nextButton = await screen.findByRole('button', { name: nextButtonText });
      await act(async () => {
        await userEvent.click(nextButton);
      });
    }

    expect(screen.getByText(/Quiz Completed!/i)).toBeInTheDocument();
    const expectedScore = 0; // Based on previous logic
    expect(screen.getByText(`You scored ${expectedScore} out of ${mockQuizDataRegular.length}.`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Restart Quiz/i })).toBeInTheDocument();
  });

  it('restarts the quiz', async () => {
    render(<QuizPage />);
    for (let i = 0; i < mockQuizDataRegular.length; i++) {
      const answerOption = await screen.findByRole('button', { name: mockQuizDataRegular[i].options[0] });
       await act(async () => {
        await userEvent.click(answerOption);
      });
      const nextButtonText = i === mockQuizDataRegular.length - 1 ? /Show Results/i : /Next Question/i;
      const nextButton = await screen.findByRole('button', { name: nextButtonText });
      await act(async () => {
        await userEvent.click(nextButton);
      });
    }

    const restartButton = screen.getByRole('button', { name: /Restart Quiz/i });
    await act(async () => {
      await userEvent.click(restartButton);
    });

    const firstQuestion = mockQuizDataRegular[0];
    expect(screen.getByText(`${firstQuestion.id}. ${firstQuestion.questionText}`)).toBeInTheDocument();
    expect(screen.getByText(`Question ${1} of ${mockQuizDataRegular.length}`)).toBeInTheDocument();
    expect(screen.getByText("Score: 0")).toBeInTheDocument();
  });

  it('displays SQL query if present in question data', () => {
    render(<QuizPage />);
    expect(screen.getByText(mockQuizDataRegular[0].sqlQuery)).toBeInTheDocument();
  });

  it('does not display SQL query area if not present in question data', async () => {
    render(<QuizPage />);
    const firstQuestion = mockQuizDataRegular[0];
    const secondQuestion = mockQuizDataRegular[1];

    const firstAnswerOption = screen.getByRole('button', { name: firstQuestion.options[0] });
    await act(async () => {
      await userEvent.click(firstAnswerOption);
    });
    const nextButton = screen.getByRole('button', { name: /Next Question/i });
    await act(async () => {
      await userEvent.click(nextButton);
    });
    expect(screen.getByText(`${secondQuestion.id}. ${secondQuestion.questionText}`)).toBeInTheDocument();
    expect(screen.queryByText(firstQuestion.sqlQuery)).not.toBeInTheDocument();
  });
});

describe('QuizPage Component - Empty Quiz Data', () => {
  let QuizPageWithEmptyData;

  beforeAll(async () => {
    vi.doMock('../data/quizQuestions.json', () => ({
      default: []
    }));
    QuizPageWithEmptyData = (await import('./QuizPage.jsx')).default;
  });

  afterAll(() => {
    vi.unmock('../data/quizQuestions.json');
    vi.resetModules();
  });

  it('handles empty quizQuestions.json gracefully', () => {
    render(<QuizPageWithEmptyData />);
    expect(screen.getByText(/No quiz questions available./i)).toBeInTheDocument();
  });
});
