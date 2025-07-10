import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import LectionsPage from './LectionsPage';

// Mock i18next
vi.mock('react-i18next', async () => {
  const original = await vi.importActual('react-i18next');
  return {
    ...original,
    useTranslation: () => ({
      t: (key) => {
        if (key === 'lections') return 'Lections';
        return key;
      },
      i18n: {
        changeLanguage: vi.fn(),
        resolvedLanguage: 'en',
      },
    }),
  };
});

// Actual data used by the component
const actualLections = [
  {
    id: 1,
    title: 'Introduction to SQL',
    url: 'https://www.w3schools.com/sql/sql_intro.asp',
    description: 'Learn the basics of SQL.',
  },
  {
    id: 2,
    title: 'SQL SELECT Statement',
    url: 'https://www.w3schools.com/sql/sql_select.asp',
    description: 'Understand how to select data from a database.',
  },
  {
    id: 3,
    title: 'SQL WHERE Clause',
    url: 'https://www.w3schools.com/sql/sql_where.asp',
    description: 'Filter records using the WHERE clause.',
  },
  {
    id: 4,
    title: 'Advanced SQL Joins',
    url: 'https://www.sqltutorial.org/sql-join/',
    description: 'Explore different types of SQL JOINs.',
  },
];

describe('LectionsPage Component', () => {
  it('renders the page title', () => {
    render(<LectionsPage />);
    expect(
      screen.getByRole('heading', { name: 'Lections', level: 2 })
    ).toBeInTheDocument();
  });

  it('renders a list of lections with titles, descriptions, and external links', () => {
    render(<LectionsPage />);

    actualLections.forEach((lection) => {
      const linkElement = screen.getByRole('link', { name: lection.title });
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', lection.url);
      expect(linkElement).toHaveAttribute('target', '_blank');
      expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
      expect(screen.getByText(lection.description)).toBeInTheDocument();
    });
  });

  it('ensures all rendered lection items are present', () => {
    render(<LectionsPage />);
    const lectionItems = screen.getAllByRole('link'); // Get all links, assuming each lection title is a link
    expect(lectionItems.length).toBe(actualLections.length);
  });
});
