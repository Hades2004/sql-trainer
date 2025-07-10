import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import App from './App';

// Mock child components to simplify App.jsx testing (focus on routing and dark mode)
vi.mock('./components/Navbar', () => ({
  __esModule: true,
  default: vi.fn(({ darkMode, setDarkMode }) => (
    <nav data-testid='mock-navbar'>
      <button onClick={() => setDarkMode(!darkMode)}>
        Toggle Dark Mode (Currently: {darkMode ? 'Dark' : 'Light'})
      </button>
      <a href='/sql-trainer/'>Home</a>
      <a href='/sql-trainer/lections'>Lections</a>
      <a href='/sql-trainer/exercises'>Exercises</a>
      <a href='/sql-trainer/quiz'>Quiz</a>
    </nav>
  )),
}));

vi.mock('./pages/HomePage', () => ({
  __esModule: true,
  default: vi.fn(({ darkMode }) => (
    <div data-testid='mock-homepage'>HomePage (Dark: {String(darkMode)})</div>
  )),
}));
vi.mock('./pages/LectionsPage', () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid='mock-lectionspage'>LectionsPage</div>),
}));
vi.mock('./pages/ExercisesPage', () => ({
  __esModule: true,
  default: vi.fn(() => (
    <div data-testid='mock-exercisespage'>ExercisesPage</div>
  )),
}));
vi.mock('./pages/ExerciseDisplayPage', () => ({
  __esModule: true,
  default: vi.fn(({ darkMode }) => (
    <div data-testid='mock-exercisedisplaypage'>
      ExerciseDisplayPage (Dark: {String(darkMode)})
    </div>
  )),
}));
vi.mock('./pages/QuizPage', () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid='mock-quizpage'>QuizPage</div>),
}));

describe('App Component', () => {
  let mockMatchMedia;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Mock window.matchMedia
    mockMatchMedia = vi.fn().mockImplementation((query) => ({
      matches: false, // Default to light mode
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: mockMatchMedia,
    });
  });

  const renderApp = (initialRoute = '/sql-trainer/') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <App />
      </MemoryRouter>
    );
  };

  it('renders Navbar and HomePage by default', () => {
    renderApp();
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-homepage')).toBeInTheDocument();
  });

  it('routes to LectionsPage', () => {
    renderApp('/sql-trainer/lections');
    expect(screen.getByTestId('mock-lectionspage')).toBeInTheDocument();
  });

  it('routes to ExercisesPage', () => {
    renderApp('/sql-trainer/exercises');
    expect(screen.getByTestId('mock-exercisespage')).toBeInTheDocument();
  });

  it('routes to ExerciseDisplayPage', () => {
    renderApp('/sql-trainer/exercise/1');
    expect(screen.getByTestId('mock-exercisedisplaypage')).toBeInTheDocument();
  });

  it('routes to QuizPage', () => {
    renderApp('/sql-trainer/quiz');
    expect(screen.getByTestId('mock-quizpage')).toBeInTheDocument();
  });

  it('initializes dark mode based on localStorage if available', () => {
    localStorage.setItem('darkMode', 'true');
    renderApp();
    expect(screen.getByTestId('mock-homepage')).toHaveTextContent(
      'HomePage (Dark: true)'
    );
    expect(document.documentElement).toHaveClass('dark');
  });

  it('initializes dark mode based on prefers-color-scheme if localStorage is not set', () => {
    mockMatchMedia.mockImplementation((query) => ({
      matches: true, // System prefers dark
      media: query,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    renderApp();
    expect(screen.getByTestId('mock-homepage')).toHaveTextContent(
      'HomePage (Dark: true)'
    );
    expect(document.documentElement).toHaveClass('dark');
  });

  it('initializes to light mode if localStorage and prefers-color-scheme indicate light', () => {
    localStorage.setItem('darkMode', 'false');
    mockMatchMedia.mockImplementation((query) => ({
      matches: false, // System prefers light
      media: query,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    renderApp();
    expect(screen.getByTestId('mock-homepage')).toHaveTextContent(
      'HomePage (Dark: false)'
    );
    expect(document.documentElement).not.toHaveClass('dark');
  });

  it('toggles dark mode state and updates localStorage and documentElement class', () => {
    renderApp();
    // Initial state (assuming default light)
    expect(screen.getByTestId('mock-homepage')).toHaveTextContent(
      'HomePage (Dark: false)'
    );
    expect(document.documentElement).not.toHaveClass('dark');
    expect(localStorage.getItem('darkMode')).toBe('false');

    // Find the toggle button within the mocked Navbar
    const toggleButton = screen.getByRole('button', {
      name: /Toggle Dark Mode/,
    });

    // Act: toggle to dark mode
    act(() => {
      fireEvent.click(toggleButton);
    });

    expect(screen.getByTestId('mock-homepage')).toHaveTextContent(
      'HomePage (Dark: true)'
    );
    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem('darkMode')).toBe('true');
    expect(document.body).toHaveClass('dark:bg-gray-900');
    expect(document.body).not.toHaveClass('bg-white');

    // Act: toggle back to light mode
    act(() => {
      fireEvent.click(toggleButton);
    });

    expect(screen.getByTestId('mock-homepage')).toHaveTextContent(
      'HomePage (Dark: false)'
    );
    expect(document.documentElement).not.toHaveClass('dark');
    expect(localStorage.getItem('darkMode')).toBe('false');
    expect(document.body).not.toHaveClass('dark:bg-gray-900');
    expect(document.body).toHaveClass('bg-white');
  });
});
