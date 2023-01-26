const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./Router/userRoutes');
const AdminRoutes = require('./Router/AdminRoutes')
const app = express();
const port = process.env.PORT || 8080;

mongoose.connect('mongodb+srv://suman207kumari:mtFUJppoLrJY6dip@cluster0.drb9gqs.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use('/admin', AdminRoutes)
app.use(express.json())

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
