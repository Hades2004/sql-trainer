import React from 'react';
import { useParams } from 'react-router-dom';
import ExerciseRunner from '../components/ExerciseRunner';

const exerciseDetailsMap = {
  "1": {
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
  INSERT INTO users VALUES (6, 'Fiona Apple', 'fiona@example.com', '2024-02-10', 'active');
  INSERT INTO users VALUES (7, 'George Harrison', 'george@example.com', '2024-02-15', 'active');
    `,
    correctQuery: "SELECT username, email FROM users WHERE date(registration_date) >= date('2024-02-15') AND status = 'active' ORDER BY username;",
    initialQuery: "SELECT username, email FROM users WHERE status = 'active';"
  },
  "2": {
    taskDescription: "Select the username and registration_date for all users who are 'inactive' and registered before '2024-01-01'.",
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
  INSERT INTO users VALUES (3, 'Charlie Brown', 'charlie@example.com', '2023-12-25', 'inactive');
  INSERT INTO users VALUES (4, 'Diana Prince', 'diana@example.com', '2024-02-20', 'active');
  INSERT INTO users VALUES (5, 'Eve Polastri', 'eve@example.com', '2023-11-01', 'inactive');
  INSERT INTO users VALUES (6, 'Frank Castle', 'frank@example.com', '2024-01-15', 'inactive');
    `,
    correctQuery: "SELECT username, registration_date FROM users WHERE status = 'inactive' AND date(registration_date) < date('2024-01-01') ORDER BY username;",
    initialQuery: "SELECT username, registration_date FROM users WHERE status = 'inactive';"
  },
  "3": {
    taskDescription: "Retrieve all columns for users. Sort the results first by 'status' in ascending order (active, inactive, pending), and then by 'registration_date' in descending order (newest first) for users with the same status.",
    schema: `CREATE TABLE users (
      user_id INT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      registration_date DATE NOT NULL,
      status VARCHAR(50) -- 'active', 'inactive', 'pending'
  );`,
    sampleDataSetup: `
  INSERT INTO users VALUES (1, 'Carol Danvers', 'carol@example.com', '2023-10-15', 'active');
  INSERT INTO users VALUES (2, 'Peter Parker', 'peter@example.com', '2024-03-01', 'pending');
  INSERT INTO users VALUES (3, 'Tony Stark', 'tony@example.com', '2023-10-15', 'inactive');
  INSERT INTO users VALUES (4, 'Bruce Wayne', 'bruce@example.com', '2024-02-20', 'active');
  INSERT INTO users VALUES (5, 'Steve Rogers', 'steve@example.com', '2023-05-05', 'pending');
  INSERT INTO users VALUES (6, 'Natasha Romanoff', 'natasha@example.com', '2024-03-01', 'active');
    `,
    correctQuery: "SELECT user_id, username, email, registration_date, status FROM users ORDER BY status ASC, registration_date DESC;",
    initialQuery: "SELECT * FROM users ORDER BY status;"
  },
  "4": {
    taskDescription: "List the names of customers and the product names of items they have ordered. Only include orders that have been 'Shipped'.",
    schema: `
  CREATE TABLE customers (
      customer_id INT PRIMARY KEY,
      customer_name VARCHAR(255) NOT NULL
  );
  CREATE TABLE products (
      product_id INT PRIMARY KEY,
      product_name VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL
  );
  CREATE TABLE orders (
      order_id INT PRIMARY KEY,
      customer_id INT,
      product_id INT,
      order_date DATE NOT NULL,
      status VARCHAR(50), -- 'Pending', 'Shipped', 'Delivered', 'Cancelled'
      FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
      FOREIGN KEY (product_id) REFERENCES products(product_id)
  );`,
    sampleDataSetup: `
  INSERT INTO customers VALUES (1, 'Arthur Dent');
  INSERT INTO customers VALUES (2, 'Ford Prefect');
  INSERT INTO customers VALUES (3, 'Zaphod Beeblebrox');

  INSERT INTO products VALUES (101, 'Towel', 5.00);
  INSERT INTO products VALUES (102, 'Electronic Thumb', 42.00);
  INSERT INTO products VALUES (103, 'Pan Galactic Gargle Blaster Mix', 15.75);

  INSERT INTO orders VALUES (1, 1, 101, '2024-01-15', 'Shipped');
  INSERT INTO orders VALUES (2, 2, 102, '2024-01-20', 'Pending');
  INSERT INTO orders VALUES (3, 1, 103, '2024-02-01', 'Shipped');
  INSERT INTO orders VALUES (4, 3, 101, '2024-02-05', 'Cancelled');
  INSERT INTO orders VALUES (5, 2, 101, '2024-02-10', 'Shipped');
  INSERT INTO orders VALUES (6, 1, 102, '2024-03-01', 'Delivered'); -- Should not be included as per "Shipped" status
    `,
    correctQuery: "SELECT c.customer_name, p.product_name FROM customers c JOIN orders o ON c.customer_id = o.customer_id JOIN products p ON o.product_id = p.product_id WHERE o.status = 'Shipped' ORDER BY c.customer_name, p.product_name;",
    initialQuery: "SELECT c.customer_name, p.product_name FROM customers c JOIN orders o ON c.customer_id = o.customer_id JOIN products p ON o.product_id = p.product_id;"
  }
};

export default function ExerciseDisplayPage() {
  const { exerciseId } = useParams();
  const exerciseDetail = exerciseDetailsMap[exerciseId];

  if (!exerciseDetail) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Exercise Not Found</h1>
        <p className="text-gray-700 dark:text-gray-300 mt-2">
          The exercise you are looking for does not exist or has not been implemented yet.
        </p>
        <Link to="/sql-trainer/exercises" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Back to Exercises
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">SQL Query Challenge: Exercise {exerciseId}</h1>
      <ExerciseRunner exerciseDetail={exerciseDetail} />
    </div>
  );
}
