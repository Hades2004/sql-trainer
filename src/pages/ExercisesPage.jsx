import React from 'react';

export default function ExercisesPage() {
  const exercises = [
    { id: 1, title: "Exercise 1: Select all columns from a table", url: "#", description: "Practice using the SELECT statement." },
    { id: 2, title: "Exercise 2: Filter data using WHERE", url: "#", description: "Apply conditions to your queries." },
    { id: 3, title: "Exercise 3: Sort results with ORDER BY", url: "#", description: "Learn to sort your query output." },
    { id: 4, title: "Exercise 4: Simple JOIN", url: "#", description: "Combine data from two tables." },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Exercises</h2>
      <div className="space-y-4">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300">
              <a href={exercise.url} onClick={(e) => e.preventDefault()} title="Link not implemented yet">
                {exercise.title}
              </a>
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mt-1">{exercise.description}</p>
            {exercise.url === "#" && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">(Link not implemented yet)</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
