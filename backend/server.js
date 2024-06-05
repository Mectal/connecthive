const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '!Thunder123',  // Your MySQL password
  database: 'connecthive'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('MySQL Connected...');
});

// Register User
app.post('/api/register', (req, res) => {
  const { name, age, gender, location, email, password } = req.body;
  const query = 'INSERT INTO users (name, age, gender, location, email, password) VALUES (?, ?, ?, ?, ?, ?)';
  
  db.query(query, [name, age, gender, location, email, password], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(400).send('Email already exists');
      } else {
        res.status(500).send('Server error');
      }
      return;
    }
    res.send('User registered');
  });
});

// Login User
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  
  db.query(query, [email, password], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.send('Login successful');
    } else {
      res.send('Invalid credentials');
    }
  });
});

// Profile Creation
app.post('/api/profile', (req, res) => {
  const { userId, hobbies, personality, lifestyle, socialPreferences, values, goals } = req.body;
  const query = 'INSERT INTO profiles (user_id, hobbies, personality, lifestyle, social_preferences, `values`, goals) VALUES (?, ?, ?, ?, ?, ?, ?)';
  
  db.query(query, [userId, hobbies, personality, lifestyle, socialPreferences, values, goals], (err, result) => {
    if (err) throw err;
    res.send('Profile created');
  });
});

// Get User by Email
app.get('/api/user/:email', (req, res) => {
  const { email } = req.params;
  const query = 'SELECT * FROM users WHERE email = ?';
  
  db.query(query, [email], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.json(results[0]); // Return the user data
    } else {
      res.status(404).send('User not found');
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
