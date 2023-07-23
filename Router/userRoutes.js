
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');

const secretKey =  'its-a-secret-key';

const User = require('../Model/userSchema');

// Register a new user
router.post('/register', async (req, res) => {
  const {email, password } = req.body;

  try {
    // Check if the username is already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(200).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Authenticate a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by the username
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }

    // User is authenticated
    const token = jwt.sign({ email, isAdmin: user.isUser }, secretKey);
    return res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
});

function authenticateToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access denied.' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }
    req.user = decoded;
    next();
  });
}

router.get('/user-data', authenticateToken, (req, res) => {
  return res.json({ message: 'User data fetched successfully.', user: req.user });
});

module.exports = router;
