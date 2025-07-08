import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { vi } from 'vitest';

describe('Navbar Component', () => {
  it('renders correctly with initial elements', () => {
    const setDarkMode = vi.fn(); // Mock function for setDarkMode

    render(
      <MemoryRouter>
        <Navbar darkMode={false} setDarkMode={setDarkMode} />
      </MemoryRouter>
    );

    // Check for brand text
    expect(screen.getByText(/SQL Trainer/i)).toBeInTheDocument();
    expect(screen.getByText(/🧪/)).toBeInTheDocument();


    // Check for dark mode toggle button (initial state: Light mode, so button shows "Dark")
    expect(screen.getByRole('button', { name: /🌙 Dark/i })).toBeInTheDocument();

    // Check for menu button (hamburger icon)
    expect(screen.getByRole('button', { name: /Open user menu/i })).toBeInTheDocument();
  });

  it('displays Light mode button when darkMode is true', () => {
    const setDarkMode = vi.fn();
    render(
      <MemoryRouter>
        <Navbar darkMode={true} setDarkMode={setDarkMode} />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /☀️ Light/i })).toBeInTheDocument();
  });
});
