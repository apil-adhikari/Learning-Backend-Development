// Start of MODULES
// 3d Party Modules
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    validate: [
      validator.isEmail,
      'Please provide a valid email eg: name@mail.com',
    ],
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
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (value) {
        return value === this.password; //abc ===xyz
      },
      message: 'Passwords are not the same, they do not match!',
    },
  },
});

// Encrypting Password
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Encrypt/Hash Password with cost of 12
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  // Deleting passwordConfirm field(not to be presisted on DB)
  this.passwordConfirm = undefined;
  next();
});

// USER MODEL: Creating Model our of userSchema
const User = mongoose.model('User', userSchema);

module.exports = User;
