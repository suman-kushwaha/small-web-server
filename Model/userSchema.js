
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email:{
    type: String,
    unique: true,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isUser: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ['admin','user'],
    default: 'admin'
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
