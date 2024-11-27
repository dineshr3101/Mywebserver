const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');
const { config, loadSecrets } = require('./config/config.js');  // Load config and secrets

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Load secrets asynchronously before starting the app
loadSecrets().then(() => {
    // Create a connection to the database using the loaded config
    const connection = mysql.createConnection({
        host: config.APP_DB_HOST,
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

    // Fetch all students from the database
    app.get('/api/students', (req, res) => {
        connection.query('SELECT * FROM students', (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch students' });
            }
            res.json(results);
        });
    });

    // Add a new student to the database
    app.post('/api/students', (req, res) => {
        const { name, address, city, state, email, phone } = req.body;
        const query = 'INSERT INTO students (name, address, city, state, email, phone) VALUES (?, ?, ?, ?, ?, ?)';
        connection.query(query, [name, address, city, state, email, phone], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to add student' });
            }
            res.json({ id: result.insertId, name, address, city, state, email, phone });
        });
    });

    // Delete a student
    app.delete('/api/students/:id', (req, res) => {
        const studentId = req.params.id;
        connection.query('DELETE FROM students WHERE id = ?', [studentId], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to delete student' });
            }
            res.json({ success: true });
        });
    });

    // Update a student
    app.put('/api/students/:id', (req, res) => {
        const studentId = req.params.id;
        const { name, address, city, state, email, phone } = req.body;
        const query = 'UPDATE students SET name = ?, address = ?, city = ?, state = ?, email = ?, phone = ? WHERE id = ?';
        connection.query(query, [name, address, city, state, email, phone, studentId], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to update student' });
            }
            res.json({ success: true });
        });
    });

    // Start the server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}).catch((err) => {
    console.error('Failed to load secrets:', err);
    process.exit(1);  // Exit if secrets loading fails
});
