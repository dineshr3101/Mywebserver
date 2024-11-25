const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const config = require('./config/config');

// Create a connection to the database using the correct keys from the config object
const connection = mysql.createConnection({
  host: config.APP_DB_HOST,  // Use the correct property names
  user: config.APP_DB_USER,
  password: config.APP_DB_PASSWORD,
  database: config.APP_DB_NAME
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

// Initialize express app
const app = express();

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Route for the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));  // Serve your homepage HTML file
});

// Route for the students page
app.get('/students', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'students.html'));  // Serve the students page HTML
});

// Route for the teachers page
app.get('/teachers', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'teachers.html'));  // Serve the teachers page HTML
});

// Optional: Handle a specific student or teacher with query params or routes
app.get('/students/:id', (req, res) => {
  const studentId = req.params.id;
  // Query the database to get student info by ID and render a custom page (example)
  connection.query('SELECT * FROM students WHERE id = ?', [studentId], (err, results) => {
    if (err) {
      return res.status(500).send('Error retrieving student details');
    }
    if (results.length === 0) {
      return res.status(404).send('Student not found');
    }
    // Here, you could render a specific student page or return their details as JSON
    res.json(results[0]); // Example: Send student data as JSON
  });
});

// Optional: Handle teacher details by ID
app.get('/teachers/:id', (req, res) => {
  const teacherId = req.params.id;
  connection.query('SELECT * FROM teachers WHERE id = ?', [teacherId], (err, results) => {
    if (err) {
      return res.status(500).send('Error retrieving teacher details');
    }
    if (results.length === 0) {
      return res.status(404).send('Teacher not found');
    }
    res.json(results[0]);  // Send teacher data as JSON
  });
});

// Handle 404 for any routes not defined
app.use((req, res) => {
  res.status(404).send('404: Page not found');
});

// Start the server
const app_port = process.env.APP_PORT || 3000;
app.listen(app_port, '0.0.0.0', () => {
  console.log(`Server is running on port ${app_port}.`);
});
