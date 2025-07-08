import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LectionsPage() {
  const { t } = useTranslation();
  const lections = [
    { id: 1, title: "Introduction to SQL", url: "https://www.w3schools.com/sql/sql_intro.asp", description: "Learn the basics of SQL." },
    { id: 2, title: "SQL SELECT Statement", url: "https://www.w3schools.com/sql/sql_select.asp", description: "Understand how to select data from a database." },
    { id: 3, title: "SQL WHERE Clause", url: "https://www.w3schools.com/sql/sql_where.asp", description: "Filter records using the WHERE clause." },
    { id: 4, title: "Advanced SQL Joins", url: "https://www.sqltutorial.org/sql-join/", description: "Explore different types of SQL JOINs." },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">{t('lections')}</h2>
      <div className="space-y-4">
        {lections.map((lection) => (
          <div key={lection.id} className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              <a href={lection.url} target="_blank" rel="noopener noreferrer">
                {lection.title}
              </a>
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mt-1">{lection.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
