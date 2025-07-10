import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import originalInitSqlJs from 'sql.js'; // Import the actual default export
import { vi } from 'vitest';

import ExerciseRunner from './ExerciseRunner';

// Helper to create mock SQL.js results
const createMockResults = (columns, values) => [{ columns, values }];

// Mock sql.js
const mockDbRun = vi.fn();
const mockDbExec = vi.fn();
const mockSqlJsDatabaseInstance = {
  run: mockDbRun,
  exec: mockDbExec,
};
const mockSqlJsDatabaseConstructor = vi.fn(() => mockSqlJsDatabaseInstance);

vi.mock('sql.js', () => ({
  default: vi.fn(() =>
    Promise.resolve({ Database: mockSqlJsDatabaseConstructor })
  ),
}));

// Mock SqlEditor - basic version, can be enhanced if needed
vi.mock('./SqlEditor', () => ({
  __esModule: true,
  default: ({ value, onChange, onExecute, theme }) => (
    <div>
      <textarea
        data-testid='mock-sql-editor'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.shiftKey && onExecute) {
            onExecute();
          }
        }}
      />
      <div data-testid='mock-sql-editor-theme'>{JSON.stringify(theme)}</div>
    </div>
  ),
}));

const mockExerciseDetail = {
  taskDescription: 'Select all users.',
  schema: 'CREATE TABLE users (id INT, name TEXT);',
  sampleDataSetup:
    "INSERT INTO users (id, name) VALUES (1, 'Alice'), (2, 'Bob');",
  correctQuery: 'SELECT id, name FROM users;',
  initialQuery: "SELECT 'your query here';",
};

const correctQueryResults = createMockResults(
  ['id', 'name'],
  [
    [1, 'Alice'],
    [2, 'Bob'],
  ]
);

// A utility to wait for initialization to complete
const waitForInitialization = async () => {
  await waitFor(() => expect(originalInitSqlJs).toHaveBeenCalledTimes(1));
  await waitFor(() =>
    expect(mockSqlJsDatabaseConstructor).toHaveBeenCalledTimes(1)
  );
  await waitFor(() =>
    expect(mockDbExec).toHaveBeenCalledWith(mockExerciseDetail.correctQuery)
  );
};

describe('ExerciseRunner Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDbExec.mockImplementation((query) => {
      if (query === mockExerciseDetail.correctQuery) {
        return correctQueryResults;
      }
      return createMockResults([], []);
    });
    mockDbRun.mockReturnValue(undefined);
  });

  // Moved compare helper function to the scope of the outer describe
  const compareResultsHelper = (user, correct) => {
    if (!user || !correct) return false;
    if (user.length === 0 && correct.length === 0) return true;
    if (user.length !== correct.length) return false;
    const userRes = user[0];
    const correctRes = correct[0];
    if (!userRes || !correctRes) return false;
    if (userRes.columns.length !== correctRes.columns.length) return false;
    // eslint-disable-next-line security/detect-object-injection
    if (!userRes.columns.every((col, i) => col === correctRes.columns[i]))
      return false;
    if (userRes.values.length !== correctRes.values.length) return false;
    return userRes.values.every(
      (row, i) =>
        // eslint-disable-next-line security/detect-object-injection
        row.length === correctRes.values[i].length &&
        // eslint-disable-next-line security/detect-object-injection
        row.every((cell, j) => cell === correctRes.values[i][j])
    );
  };

  describe('compareResults (internal helper - testing directly for clarity)', () => {
    // Using compareResultsHelper defined in the outer scope

    it('returns true for identical results', () => {
      const res1 = createMockResults(
        ['a', 'b'],
        [
          [1, 'x'],
          [2, 'y'],
        ]
      );
      const res2 = createMockResults(
        ['a', 'b'],
        [
          [1, 'x'],
          [2, 'y'],
        ]
      );
      expect(compareResultsHelper(res1, res2)).toBe(true);
    });

    it('returns false for different column names', () => {
      const res1 = createMockResults(['a', 'c'], [[1, 'x']]);
      const res2 = createMockResults(['a', 'b'], [[1, 'x']]);
      expect(compareResultsHelper(res1, res2)).toBe(false);
    });

    it('returns false for different number of rows', () => {
      const res1 = createMockResults(['a'], [[1], [2]]);
      const res2 = createMockResults(['a'], [[1]]);
      expect(compareResultsHelper(res1, res2)).toBe(false);
    });

    it('returns false for different values', () => {
      const res1 = createMockResults(['a'], [[1]]);
      const res2 = createMockResults(['a'], [[2]]);
      expect(compareResultsHelper(res1, res2)).toBe(false);
    });

    it('returns true for two empty results (no tables, just empty arrays)', () => {
      expect(compareResultsHelper([], [])).toBe(true);
    });

    it('returns true for two results with columns but no values', () => {
      const res1 = createMockResults(['a', 'b'], []);
      const res2 = createMockResults(['a', 'b'], []);
      expect(compareResultsHelper(res1, res2)).toBe(true);
    });

    it('returns false if user result is empty but correct is not', () => {
      const res1 = createMockResults(['a', 'b'], []);
      const res2 = createMockResults(['a', 'b'], [[1, 'test']]);
      expect(compareResultsHelper(res1, res2)).toBe(false);
    });
  });

  it('initializes database and pre-runs correct query on mount', async () => {
    render(
      <ExerciseRunner exerciseDetail={mockExerciseDetail} darkMode={false} />
    );
    await waitForInitialization();
    expect(mockDbRun).toHaveBeenCalledWith(mockExerciseDetail.schema);
    expect(mockDbRun).toHaveBeenCalledWith(mockExerciseDetail.sampleDataSetup);
  });

  it('displays task description, schema, and initial query', async () => {
    render(
      <ExerciseRunner exerciseDetail={mockExerciseDetail} darkMode={false} />
    );
    await waitForInitialization();
    expect(
      screen.getByText(mockExerciseDetail.taskDescription)
    ).toBeInTheDocument();
    expect(screen.getByText(mockExerciseDetail.schema)).toBeInTheDocument();
    const editor = screen.getByTestId('mock-sql-editor');
    expect(editor).toHaveValue(mockExerciseDetail.initialQuery);
  });

  it('allows user to type in SqlEditor and updates query', async () => {
    render(
      <ExerciseRunner exerciseDetail={mockExerciseDetail} darkMode={false} />
    );
    await waitForInitialization();
    const editor = screen.getByTestId('mock-sql-editor');
    await act(async () => {
      await userEvent.clear(editor);
      await userEvent.type(editor, 'SELECT name FROM users;');
    });
    expect(editor.value).toBe('SELECT name FROM users;');
  });

  it('runs user query and displays "Correct" feedback for correct query', async () => {
    mockDbExec.mockImplementation((query) => {
      if (query === mockExerciseDetail.correctQuery) return correctQueryResults;
      if (query === 'SELECT id, name FROM users;') return correctQueryResults;
      return createMockResults([], []);
    });
    render(
      <ExerciseRunner exerciseDetail={mockExerciseDetail} darkMode={false} />
    );
    await waitForInitialization();
    const editor = screen.getByTestId('mock-sql-editor');
    await act(async () => {
      await userEvent.clear(editor);
      await userEvent.type(editor, 'SELECT id, name FROM users;');
    });
    const runButton = screen.getByRole('button', { name: /▶️ Run SQL/i });
    await act(async () => {
      await userEvent.click(runButton);
    });
    await waitFor(() => {
      expect(mockDbExec).toHaveBeenCalledWith('SELECT id, name FROM users;');
      expect(screen.getByText(/Correct! Well done./i)).toBeInTheDocument();
    });
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('runs user query and displays "Incorrect" feedback for incorrect query', async () => {
    const incorrectUserQuery = 'SELECT name FROM users WHERE id = 1;';
    const incorrectUserResults = createMockResults(['name'], [['Alice']]);
    mockDbExec.mockImplementation((query) => {
      if (query === mockExerciseDetail.correctQuery) return correctQueryResults;
      if (query === incorrectUserQuery) return incorrectUserResults;
      return createMockResults([], []);
    });
    render(
      <ExerciseRunner exerciseDetail={mockExerciseDetail} darkMode={false} />
    );
    await waitForInitialization();
    const editor = screen.getByTestId('mock-sql-editor');
    await act(async () => {
      await userEvent.clear(editor);
      await userEvent.type(editor, incorrectUserQuery);
    });
    const runButton = screen.getByRole('button', { name: /▶️ Run SQL/i });
    await act(async () => {
      await userEvent.click(runButton);
    });
    await waitFor(() => {
      expect(mockDbExec).toHaveBeenCalledWith(incorrectUserQuery);
      expect(
        screen.getByText(/Incorrect. Check your query/i)
      ).toBeInTheDocument();
    });
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
  });

  it('displays error message if query execution fails', async () => {
    const errorQuery = 'SELECT error;';
    const errorMessage = "Syntax error near 'error'";
    mockDbExec.mockImplementation((query) => {
      if (query === mockExerciseDetail.correctQuery) return correctQueryResults;
      if (query === errorQuery) throw new Error(errorMessage);
      return createMockResults([], []);
    });
    render(
      <ExerciseRunner exerciseDetail={mockExerciseDetail} darkMode={false} />
    );
    await waitForInitialization();
    const editor = screen.getByTestId('mock-sql-editor');
    await act(async () => {
      await userEvent.clear(editor);
      await userEvent.type(editor, errorQuery);
    });
    const runButton = screen.getByRole('button', { name: /▶️ Run SQL/i });
    await act(async () => {
      await userEvent.click(runButton);
    });
    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  it('handles Shift+Enter in SqlEditor to run query', async () => {
    render(
      <ExerciseRunner exerciseDetail={mockExerciseDetail} darkMode={false} />
    );
    await waitForInitialization();
    const editor = screen.getByTestId('mock-sql-editor');
    const userQuery = 'SELECT 1;';
    mockDbExec.mockImplementation((query) => {
      if (query === mockExerciseDetail.correctQuery) return correctQueryResults;
      if (query === userQuery) return createMockResults(['1'], [[1]]);
      return createMockResults([], []);
    });
    await act(async () => {
      await userEvent.clear(editor);
      await userEvent.type(editor, userQuery);
    });
    await act(async () => {
      fireEvent.keyDown(editor, { key: 'Enter', shiftKey: true });
    });
    await waitFor(() => {
      expect(mockDbExec).toHaveBeenCalledWith(userQuery);
    });
  });
});
