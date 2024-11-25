const express = require('express');
const mysql = require('mysql2');
const config = require('./config/config');

// Create a connection to the database
const connection = mysql.createConnection({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database
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
const app_port = process.env.APP_PORT || 3000;
app.listen(app_port, () => {
    console.log(`Server is running on port ${app_port}.`);
});
