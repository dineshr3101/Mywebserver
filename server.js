const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const { config, loadSecrets } = require('./config/config');

// Initialize express app
const app = express();

// Middleware to parse JSON request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make sure secrets are loaded before using the config
async function startServer() {
  try {
    await loadSecrets(); // Wait for secrets to be loaded

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

    // Serve static files from the 'public' folder
    app.use(express.static(path.join(__dirname, 'public')));

    // Route for the homepage
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    // Route to handle adding a new student
    app.post('/add-student', (req, res) => {
      const { name, address, city, state, email, phone } = req.body;

      const query = 'INSERT INTO students (name, address, city, state, email, phone) VALUES (?, ?, ?, ?, ?, ?)';
      connection.query(query, [name, address, city, state, email, phone], (err, result) => {
        if (err) {
          console.error('Error inserting student into database:', err);
          return res.status(500).send('Database error');
        }
        res.json({ id: result.insertId, message: 'Student added successfully' });
      });
    });

    // Route to fetch all students from the database
    app.get('/students', (req, res) => {
      connection.query('SELECT * FROM students', (err, results) => {
        if (err) {
          console.error('Error fetching students from database:', err);
          return res.status(500).send('Database query error');
        }
        res.json(results);
      });
    });

    // Start the server
    const app_port = process.env.APP_PORT || 3000;
    app.listen(app_port, '0.0.0.0', () => {
      console.log(`Server is running on port ${app_port}.`);
    });
  } catch (err) {
    console.error('Error during server startup:', err);
  }
}

// Start the server
startServer();
