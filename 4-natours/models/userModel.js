// Start of MODULES
const crypto = require('crypto');
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
    default: 'default.jpg',
    // required: [true, 'Photo URL is required'],
    // trim: true,
    // Regex to insure its an image file (case-insensitive)
    // match: [
    //   /\.(jpg|jpeg|png|gif|webp)$/i,
    //   'Photo must be a valid  image URL (jpg, jpeg, png, gif, webp)',
    // ],
  },

  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },

  password: {
    type: String,
    required: [true, 'User must enter a password'],
    trim: true,
    minLength: [8, 'Password must be atleast 8 characters'],
    maxLenght: [128, 'Password must not be more than 128 characters'],
    select: false,
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
  // Password changed
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,

  // Setting active falg
  active: {
    type: Boolean,
    default: true,
    select: false,
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

// Reset Password Password Changed At
userSchema.pre('save', function (next) {
  // if we modified the password property
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000; //Sometimes the JWT token can issue faster than the this timestapmps which will lead us not to be able to login. So, we changed the timestamps to 1 second before the Date.now(). This insures the token wil be created 1 second after the password has been changed.
  next();
});

// Using Query Middleware to do certain action before doing query
userSchema.pre(/^find/, function (next) {
  // this points to current query
  this.find({ active: { $ne: false } });
  next();
});

//USE SCHEMA  Check if the given password is same as the password stored in DataBase
userSchema.methods.verifyPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    // console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  // false mean NOT changed
  return false; // by default we set password changed to false
};

// Forgot Password
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  console.log('restet token created', resetToken);
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 600000; // This wil expire in 10 minutes

  return resetToken;
};

// USER MODEL: Creating Model our of userSchema
const User = mongoose.model('User', userSchema);

module.exports = User;
