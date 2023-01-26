// routes/customers.js

const express = require('express');
const router = express.Router();
const authenticateToken = require('./AdminRoutes');

// Middleware to restrict access to only admins
function isAdmin(req, res, next) {
  if (req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
}

// Route for listing customers accessible only by admins
router.get('/list', authenticateToken, isAdmin, (req, res) => {
  // Here, fetch the list of customers and send it back in the response.
  res.json({ customers: ['Customer 1', 'Customer 2', 'Customer 3'] });
});

module.exports = router;
