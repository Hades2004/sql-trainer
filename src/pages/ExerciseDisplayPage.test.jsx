import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import ExerciseRunner from '../components/ExerciseRunner'; // Needed for mocking

import ExerciseDisplayPage from './ExerciseDisplayPage';

// Mock ExerciseRunner component
vi.mock('../components/ExerciseRunner', () => ({
  __esModule: true,
  default: vi.fn(({ exerciseDetail, darkMode }) => (
    <div data-testid='mock-exercise-runner'>
      <p>Task: {exerciseDetail.taskDescription}</p>
      <p>Schema: {exerciseDetail.schema}</p>
      <p>Initial Query: {exerciseDetail.initialQuery}</p>
      <p>Dark Mode: {darkMode.toString()}</p>
    </div>
  )),
}));

// Mock i18next (optional, if t function is used directly in ExerciseDisplayPage, which it isn't here)
// vi.mock('react-i18next', () => ({
//   useTranslation: () => ({ t: (key) => key }),
// }));

// The exerciseDetailsMap is internal to ExerciseDisplayPage.jsx
// We can't directly mock it without heavier techniques like babel plugins or proxyquire.
// Instead, we test by navigating to routes that correspond to existing and non-existing exercise IDs.

describe('ExerciseDisplayPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (ui, { route = '/', path = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path={path} element={ui} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders the ExerciseRunner with correct details for a valid exercise ID', async () => {
    renderWithRouter(<ExerciseDisplayPage darkMode={false} />, {
      route: '/sql-trainer/exercise/1',
      path: '/sql-trainer/exercise/:exerciseId',
    });

    await waitFor(() => {
      expect(screen.getByTestId('mock-exercise-runner')).toBeInTheDocument();
    });

    // Check if ExerciseRunner was called with the correct props (simplified check)
    // exerciseDetailsMap[1] is the expected detail for exerciseId 1
    expect(ExerciseRunner).toHaveBeenCalled();
    const lastCallArgs =
      ExerciseRunner.mock.calls[ExerciseRunner.mock.calls.length - 1][0];
    expect(lastCallArgs.exerciseDetail.taskDescription).toContain(
      'Retrieve the usernames and email addresses'
    ); // Check a snippet
    expect(lastCallArgs.darkMode).toBe(false);

    expect(
      screen.getByText('SQL Query Challenge: Exercise 1')
    ).toBeInTheDocument();
    // Check content passed to the mock
    expect(
      screen.getByText(/Task: Retrieve the usernames and email addresses/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Schema: CREATE TABLE users/)).toBeInTheDocument();
  });

  it('passes darkMode prop correctly to ExerciseRunner', async () => {
    renderWithRouter(<ExerciseDisplayPage darkMode={true} />, {
      route: '/sql-trainer/exercise/1',
      path: '/sql-trainer/exercise/:exerciseId',
    });

    await waitFor(() => {
      expect(screen.getByTestId('mock-exercise-runner')).toBeInTheDocument();
    });
    expect(ExerciseRunner).toHaveBeenCalled();
    const lastCallArgs =
      ExerciseRunner.mock.calls[ExerciseRunner.mock.calls.length - 1][0];
    expect(lastCallArgs.darkMode).toBe(true);
    expect(screen.getByText('Dark Mode: true')).toBeInTheDocument();
  });

  it('displays a "Not Found" message for an invalid exercise ID', async () => {
    renderWithRouter(<ExerciseDisplayPage darkMode={false} />, {
      route: '/sql-trainer/exercise/999', // Non-existent ID
      path: '/sql-trainer/exercise/:exerciseId',
    });

    await waitFor(() => {
      expect(screen.getByText('Exercise Not Found')).toBeInTheDocument();
    });
    expect(
      screen.getByText(
        'The exercise you are looking for does not exist or has not been implemented yet.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Back to Exercises' })
    ).toHaveAttribute('href', '/sql-trainer/exercises');
    expect(
      screen.queryByTestId('mock-exercise-runner')
    ).not.toBeInTheDocument();
  });

  it('displays a "Not Found" message for an exercise ID that is not in the map but might be a string like "abc"', async () => {
    renderWithRouter(<ExerciseDisplayPage darkMode={false} />, {
      route: '/sql-trainer/exercise/abc', // Non-numeric, non-existent ID
      path: '/sql-trainer/exercise/:exerciseId',
    });

    await waitFor(() => {
      expect(screen.getByText('Exercise Not Found')).toBeInTheDocument();
    });
  });
});
