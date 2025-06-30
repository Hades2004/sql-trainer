import React from 'react';
import ExerciseRunner from '../components/ExerciseRunner';

const exercise1Details = {
  taskDescription: "Retrieve the usernames and email addresses of all users who registered on or after '2024-02-15' (inclusive) and are marked as 'active'.\n\nReference date for 'today' is '2024-03-15'. Your query should select users registered in the 30 days leading up to this reference date.",
  schema: `CREATE TABLE users (
    user_id INT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    registration_date DATE NOT NULL,
    status VARCHAR(50) -- 'active', 'inactive', 'pending'
);`,
  sampleDataSetup: `
INSERT INTO users VALUES (1, 'Alice Wonderland', 'alice@example.com', '2023-10-15', 'active');
INSERT INTO users VALUES (2, 'Bob The Builder', 'bob@example.com', '2024-03-01', 'active');
INSERT INTO users VALUES (3, 'Charlie Brown', 'charlie@example.com', '2024-03-10', 'inactive');
INSERT INTO users VALUES (4, 'Diana Prince', 'diana@example.com', '2024-02-20', 'active');
INSERT INTO users VALUES (5, 'Edward Scissorhands', 'edward@example.com', '2023-05-05', 'pending');
INSERT INTO users VALUES (6, 'Fiona Apple', 'fiona@example.com', '2024-02-10', 'active'); -- This one should be excluded by the 30-day window relative to 2024-03-15
INSERT INTO users VALUES (7, 'George Harrison', 'george@example.com', '2024-02-15', 'active'); -- This one should be included
  `,
  // Correct query uses a fixed reference date '2024-03-15' to make the "last 30 days" consistent for checking.
  // date('2024-03-15', '-30 days') would be '2024-02-14'. So we need >= '2024-02-14' (or > '2024-02-13') effectively.
  // The problem states "on or after '2024-02-15'", so this is the lower bound.
  correctQuery: "SELECT username, email FROM users WHERE date(registration_date) >= date('2024-02-15') AND status = 'active' ORDER BY username;",
  initialQuery: "SELECT username, email FROM users WHERE status = 'active';"
};

// Expected results for the correctQuery, used by ExerciseRunner's compareResults
// (2, 'Bob The Builder', 'bob@example.com', '2024-03-01', 'active')
// (4, 'Diana Prince', 'diana@example.com', '2024-02-20', 'active')
// (7, 'George Harrison', 'george@example.com', '2024-02-15', 'active')
// Order by username for consistent comparison
// Bob The Builder, bob@example.com
// Diana Prince, diana@example.com
// George Harrison, george@example.com


export default function ExerciseDisplayPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">SQL Query Challenge</h1>
      <ExerciseRunner exerciseDetail={exercise1Details} />
    </div>
  );
}
