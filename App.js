const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./Router/userRoutes');
const AdminRoutes = require('./Router/AdminRoutes');
const Customer = require('./Router/Customer');
const app = express();
const port = process.env.PORT || 8080;

mongoose.connect('mongodb+srv://suman207kumari:mtFUJppoLrJY6dip@cluster0.drb9gqs.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use('/admin', AdminRoutes);
app.use('/user',userRoutes);
app.use('/Customer',Customer)

app.use(express.json())

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
