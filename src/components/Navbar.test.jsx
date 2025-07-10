import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import i18n from '../i18n'; // Import i18n instance

import Navbar from './Navbar';

// Mock i18next
let currentMockLanguageForTest = 'en'; // Renamed to avoid confusion

const mockT = (key) => {
  const translations = {
    en: {
      sqlTrainer: '🧪 SQL Trainer',
      lightMode: '☀️ Light',
      darkMode: '🌙 Dark',
      openUserMenu: 'Open user menu',
      home: 'Home',
      lections: 'Lections',
      exercises: 'Exercises',
      quiz: 'Quiz',
    },
    de: {
      sqlTrainer: '🧪 SQL Trainer DE',
      lightMode: '☀️ Hell',
      darkMode: '🌙 Dunkel',
      openUserMenu: 'Benutzermenü öffnen',
      home: 'Startseite',
      lections: 'Lektionen',
      exercises: 'Übungen',
      quiz: 'Quiz DE',
    },
  };
  return translations[currentMockLanguageForTest]?.[key] || key;
};

const mockI18nConfig = {
  changeLanguage: vi.fn((lng) => {
    currentMockLanguageForTest = lng;
    // The getter for resolvedLanguage will now pick up this change.
    // If the actual i18n instance is also used, ensure it's updated too.
    if (i18n && typeof i18n.changeLanguage === 'function') {
      i18n.changeLanguage(lng); // Call on actual instance if needed for other parts
    }
  }),
  get resolvedLanguage() {
    return currentMockLanguageForTest;
  },
  // 'language' prop for i18n object might also need to be a getter or updated by changeLanguage
  get language() {
    return currentMockLanguageForTest;
  },
};

vi.mock('react-i18next', async () => {
  const original = await vi.importActual('react-i18next');
  return {
    ...original,
    useTranslation: () => ({
      t: mockT,
      i18n: mockI18nConfig, // Use the renamed config object
    }),
  };
});

describe('Navbar Component', () => {
  beforeEach(() => {
    // Reset i18n language to English before each test
    currentMockLanguageForTest = 'en'; // Reset our mock's language
    // No direct assignment to mockI18nConfig.resolvedLanguage as it's a getter
    if (i18n && typeof i18n.changeLanguage === 'function') {
      i18n.changeLanguage('en'); // Reset the actual i18n instance if it's being used
    }
    vi.clearAllMocks(); // Clear mocks, especially for mockI18nConfig.changeLanguage calls
  });

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

  it('toggles dark mode when the theme button is clicked', () => {
    const setDarkMode = vi.fn();
    render(
      <MemoryRouter>
        <Navbar darkMode={false} setDarkMode={setDarkMode} />
      </MemoryRouter>
    );

    const darkModeButton = screen.getByRole('button', { name: /🌙 Dark/i });
    fireEvent.click(darkModeButton);
    expect(setDarkMode).toHaveBeenCalledTimes(1);
    // expect(setDarkMode).toHaveBeenCalledWith(expect.any(Function)); // More specific if needed
  });

  it('opens and closes the menu dropdown', () => {
    const setDarkMode = vi.fn();
    render(
      <MemoryRouter>
        <Navbar darkMode={false} setDarkMode={setDarkMode} />
      </MemoryRouter>
    );

    const menuButton = screen.getByRole('button', { name: /Open user menu/i });
    fireEvent.click(menuButton);

    // Menu items should be visible
    expect(screen.getByRole('menuitem', { name: /Home/i })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: /Lections/i })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: /Exercises/i })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: /Quiz/i })).toBeVisible();

    // Click again to close
    fireEvent.click(menuButton);
    // Use queryByRole for elements that might not be present
    expect(screen.queryByRole('menuitem', { name: /Home/i })).toBeNull();

    // Test closing by clicking outside (simulated by clicking body, though not perfect)
    fireEvent.click(menuButton); // Re-open
    expect(screen.getByRole('menuitem', { name: /Home/i })).toBeVisible();
    fireEvent.mouseDown(document.body); // Simulate click outside
    expect(screen.queryByRole('menuitem', { name: /Home/i })).toBeNull();
  });

  it('opens and closes the language dropdown and changes language', async () => {
    // Added async
    const setDarkMode = vi.fn();
    render(
      <MemoryRouter>
        <Navbar darkMode={false} setDarkMode={setDarkMode} />
      </MemoryRouter>
    );

    // Initial state: English. Accessible name is "English flag English"
    let langButton = screen.getByRole('button', {
      name: /English flag English/i,
    });
    fireEvent.click(langButton);

    // Language options should be visible. Accessible names include flags.
    let germanOption = screen.getByRole('menuitem', {
      name: /Deutsch flag Deutsch/i,
    });
    expect(germanOption).toBeVisible();
    expect(
      screen.getByRole('menuitem', { name: /English flag English/i })
    ).toBeVisible();

    // Change language to German
    fireEvent.click(germanOption);
    expect(mockI18nConfig.changeLanguage).toHaveBeenCalledWith('de');
    // Dropdown should close
    expect(
      screen.queryByRole('menuitem', { name: /Deutsch flag Deutsch/i })
    ).toBeNull();

    // Button text should update to German. Accessible name "Deutsch flag Deutsch"
    // Wait for any potential asynchronous updates from i18n state change, though our mock is synchronous.
    // Using findByRole to handle potential async updates, though getByRole should work with sync mock.
    langButton = await screen.findByRole('button', {
      name: /Deutsch flag Deutsch/i,
    });
    expect(langButton).toBeInTheDocument();

    // Test closing by clicking outside
    fireEvent.click(langButton); // Re-open with German button
    // Ensure options are visible again
    germanOption = screen.getByRole('menuitem', {
      name: /Deutsch flag Deutsch/i,
    });
    const englishOption = screen.getByRole('menuitem', {
      name: /English flag English/i,
    });
    expect(germanOption).toBeVisible();
    expect(englishOption).toBeVisible();

    fireEvent.mouseDown(document.body); // Simulate click outside
    expect(
      screen.queryByRole('menuitem', { name: /Deutsch flag Deutsch/i })
    ).toBeNull();
  });

  it('closes menu dropdown when a link is clicked', () => {
    const setDarkMode = vi.fn();
    render(
      <MemoryRouter>
        <Navbar darkMode={false} setDarkMode={setDarkMode} />
      </MemoryRouter>
    );

    const menuButton = screen.getByRole('button', { name: /Open user menu/i });
    fireEvent.click(menuButton); // Open menu

    const homeLink = screen.getByRole('menuitem', { name: /Home/i });
    fireEvent.click(homeLink);

    // Menu should be closed
    expect(screen.queryByRole('menuitem', { name: /Home/i })).toBeNull();
  });
});
