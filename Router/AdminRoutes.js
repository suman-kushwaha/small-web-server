const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');
const Product = require('../Model/productSchema')
const secretKey =  'its-a-secret-key';

const Admin = require('../Model/AdminSchema');

// Register a new user
router.post('/admin-register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the username is already taken
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new Admin({
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
router.post('/admin-login', async (req, res) => {
    console.log("hii");
  const { email, password } = req.body;

  try {
    // Find the user by the username
    const user = await Admin.findOne({ email });

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
    const token = jwt.sign({ email, isAdmin: user.isAdmin }, secretKey);
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
router.post('/products', authenticateToken, (req, res) => {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Admin access only.' });
    }
  
    const { name, description, price, category, imageUrl } = req.body;
  
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      imageUrl,
    });
    newProduct
    .save()
    .then((product) => {
      return res.json({ message: 'Product created successfully.', product });
    })
    .catch((error) => {
      return res.status(500).json({ message: 'Server error.', error });
    });
});

// Get all products (admin-only)
router.get('/products', authenticateToken, (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Forbidden: Admin access only.' });
  }

  Product.find({})
    .then((products) => {
      return res.json({ message: 'Products retrieved successfully.', products });
    })
    .catch((error) => {
      return res.status(500).json({ message: 'Server error.', error });
    });
});

// Update a product (admin-only)
router.put('/products/:productId', authenticateToken, (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Forbidden: Admin access only.' });
  }

  const { name, description, price, category, imageUrl } = req.body;
  Product.findByIdAndUpdate(
    req.params.productId,
    {
      name,
      description,
      price,
      category,
      imageUrl,
      updatedAt: Date.now(),
    },
    { new: true } // Return the updated product
  )
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }
      return res.json({ message: 'Product updated successfully.', product });
    })
    .catch((error) => {
      return res.status(500).json({ message: 'Server error.', error });
    });
});
router.delete('/products/:productId', authenticateToken, (req, res) => {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Admin access only.' });
    }
  
    Product.findByIdAndRemove(req.params.productId)
      .then((product) => {
        if (!product) {
          return res.status(404).json({ message: 'Product not found.' });
        }
        return res.json({ message: 'Product deleted successfully.', product });
      })
      .catch((error) => {
        return res.status(500).json({ message: 'Server error.', error });
      });
  });
module.exports = router;
