import React from 'react';

import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

export default function ExercisesPage() {
  const exercises = [
    {
      id: 1,
      title: "Exercise 1: Filter and Select Users",
      url: "/sql-trainer/exercise/1", // Updated URL
      description: "Retrieve specific user data based on registration date and status."
    },
    { id: 2, title: "Exercise 2: Filter data using WHERE (Placeholder)", url: "#", description: "Apply conditions to your queries." },
    { id: 3, title: "Exercise 3: Sort results with ORDER BY (Placeholder)", url: "#", description: "Learn to sort your query output." },
    { id: 4, title: "Exercise 4: Simple JOIN (Placeholder)", url: "#", description: "Combine data from two tables." },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">SQL Exercises</h2>
      <div className="space-y-4">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300">
              {exercise.url === "#" ? (
                <a href={exercise.url} onClick={(e) => e.preventDefault()} title="Link not implemented yet">
                  {exercise.title}
                </a>
              ) : (
                <Link to={exercise.url} title={exercise.title}>
                  {exercise.title}
                </Link>
              )}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mt-1">{exercise.description}</p>
            {exercise.url === "#" && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">(Interactive exercise coming soon)</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
