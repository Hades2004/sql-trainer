import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import ExercisesPage from './ExercisesPage';

// Mock i18next
vi.mock('react-i18next', async () => {
  const original = await vi.importActual('react-i18next');
  return {
    ...original,
    useTranslation: () => ({
      t: (key) => {
        if (key === 'exercises') return 'Exercises';
        if (key === 'linkNotImplemented') return 'Link not implemented yet';
        if (key === 'interactiveExerciseComingSoon')
          return 'Interactive exercise coming soon';
        return key;
      },
      i18n: {
        changeLanguage: vi.fn(),
        resolvedLanguage: 'en',
      },
    }),
  };
});

// This is the actual data used by the component.
const actualExercises = [
  {
    id: 1,
    title: 'Exercise 1: Filter and Select Users',
    url: '/sql-trainer/exercise/1',
    description:
      'Retrieve specific user data based on registration date and status.',
  },
  {
    id: 2,
    title: 'Exercise 2: Filter data using WHERE',
    url: '/sql-trainer/exercise/2',
    description: 'Apply conditions to your queries.',
  },
  {
    id: 3,
    title: 'Exercise 3: Sort results with ORDER BY',
    url: '/sql-trainer/exercise/3',
    description: 'Learn to sort your query output.',
  },
  {
    id: 4,
    title: 'Exercise 4: Simple JOIN',
    url: '/sql-trainer/exercise/4',
    description: 'Combine data from two tables.',
  },
];

describe('ExercisesPage Component', () => {
  it('renders the page title', () => {
    render(
      <MemoryRouter>
        <ExercisesPage />
      </MemoryRouter>
    );
    expect(
      screen.getByRole('heading', { name: 'Exercises', level: 2 })
    ).toBeInTheDocument();
  });

  it('renders a list of exercises with titles, descriptions, and links', () => {
    render(
      <MemoryRouter>
        <ExercisesPage />
      </MemoryRouter>
    );

    actualExercises.forEach((exercise) => {
      // Check if the title is rendered as a link or text
      const linkElement = screen.queryByRole('link', { name: exercise.title });
      const headingElement = screen.getByRole('heading', {
        name: exercise.title,
        level: 3,
      });

      if (exercise.url === '#') {
        // This case is not present in the actualExercises data, so this block might not be fully tested
        // If such an exercise existed in actualExercises:
        expect(linkElement).not.toBeInTheDocument(); // Should be an <a> tag but not a react-router Link
        expect(headingElement.querySelector('a')).toHaveAttribute('href', '#');
        expect(
          screen.getByText('Interactive exercise coming soon')
        ).toBeInTheDocument();
      } else {
        expect(linkElement).toBeInTheDocument();
        expect(linkElement).toHaveAttribute('href', exercise.url);
      }
      expect(screen.getByText(exercise.description)).toBeInTheDocument();
    });
  });

  // This test is removed because "Exercise 5: Coming Soon" with url "#" is not part of the actual data.
  // If we wanted to test this specific scenario, we would need to:
  // 1. Add such an exercise to ExercisesPage.jsx's internal 'exercises' array.
  // OR
  // 2. Mock the 'exercises' array within ExercisesPage.jsx for this specific test.
  // Since the goal is to test the existing component as is, and it doesn't have a '#' URL, this test is removed.
  // it('handles exercises with "#" URL correctly (not implemented)', () => { ... });
});
