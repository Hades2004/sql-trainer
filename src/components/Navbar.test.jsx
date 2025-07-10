import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import Navbar from './Navbar';

describe('Navbar Component', () => {
  it('renders correctly with initial elements', () => {
    const setDarkMode = vi.fn(); // Mock function for setDarkMode

    render(
      <MemoryRouter>
        <Navbar darkMode={false} setDarkMode={setDarkMode} />
      </MemoryRouter>
    );

    // Check for brand text
    expect(screen.getByText(/🧪 SQL Trainer/i)).toBeInTheDocument();

    // Check for language switcher button (initial state: English)
    const langButton = screen.getByRole('button', {
      name: (accessibleName, element) => {
        const hasFlag =
          element.querySelector('span[role="img"]')?.textContent === '🇬🇧';
        const hasText = accessibleName.includes('English'); // Text node "English"
        // The accessible name might be a combination like "English flag English"
        return hasFlag && hasText;
      },
    });
    expect(langButton).toBeInTheDocument();

    // Check for dark mode toggle button (initial state: Light mode, so button shows "Dark")
    expect(
      screen.getByRole('button', { name: /🌙 Dark/i })
    ).toBeInTheDocument();

    // Check for menu button (hamburger icon)
    expect(
      screen.getByRole('button', { name: /Open user menu/i })
    ).toBeInTheDocument();
  });

  it('displays Light mode button when darkMode is true', () => {
    const setDarkMode = vi.fn();
    render(
      <MemoryRouter>
        <Navbar darkMode={true} setDarkMode={setDarkMode} />
      </MemoryRouter>
    );
    expect(
      screen.getByRole('button', { name: /☀️ Light/i })
    ).toBeInTheDocument();
  });
});
