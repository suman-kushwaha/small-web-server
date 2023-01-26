const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email:{
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  
  },
  isAdmin: {
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

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
