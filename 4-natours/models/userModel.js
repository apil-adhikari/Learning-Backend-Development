// Start of MODULES
// Core Modules

// 3d Party Modules
const mongoose = require('mongoose');
const validator = require('validator');

// Local Modules

// End of MODULES

// USER SCHEMA
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true,
    minLength: [3, 'Name must have more or equal to 3 characters'],
    maxLenght: [30, 'Name must have less or equal to 30 characters'],
  },
  email: {
    type: String,
    required: [true, 'A user must input email address (name@mail.com)'],
    unique: true,
    trim: true,
    lowercase: true,
    // minLength: [6, 'Email must have more or equal to 6 characters'],
    // maxLength: [254, 'Email must have more or equal to 254 characters'],
    // // Regex to validate email
    // match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],

    // Using validator package
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
    // required: [true, 'Photo URL is required'],
    // trim: true,
    // Regex to insure its an image file (case-insensitive)
    // match: [
    //   /\.(jpg|jpeg|png|gif|webp)$/i,
    //   'Photo must be a valid  image URL (jpg, jpeg, png, gif, webp)',
    // ],
  },

  password: {
    type: String,
    required: [true, 'User must enter a password'],
    trim: true,
    minLength: [8, 'Password must be atleast 8 characters'],
    maxLenght: [128, 'Password must not be more than 128 characters'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
  },
});

// USER MODEL: Creating Model our of userSchema
const User = mongoose.model('User', userSchema);

module.exports = User;
