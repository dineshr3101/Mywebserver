const express = require('express');
const mysql = require('mysql2');
const { config } = require('./config/config');  // Destructure config from the config module

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
app.use(express.static('public'));

// Start the server
const app_port = process.env.APP_PORT || 3001;
app.listen(app_port, '0.0.0.0', () => {
    console.log(`Server is running on port ${app_port}.`);
});
