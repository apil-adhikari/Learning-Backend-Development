// Start of MODULES
// 3rd Party Modules
const jwt = require('jsonwebtoken');

// Local Modules
const User = require('../models/userModel');
const catchAsyncError = require('../utils/catchAsyncError');

// End of MOUDLES

exports.signup = catchAsyncError(async (req, res, next) => {
  /** // BUG
   *  SECURITY FLAW:
   * *  // FIXME: const newUser = await User.create(req.body);
   * 1. This create user based on the data that comes directly from req.body through the client.
   * 2. We create a new user with all the data that is coming with the body.
   * 3. Actual Problem :  Any one can specify role as an ADMIN. (Anyone can create an account with an admin role). Which is not what we need.
   * // FIX : Taking only required fields only so that no other data will be saved. Only allow data we actaully need.
   */

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // Loggin User As soon as he signups.
  // Create TOKEN
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: 'success',
    // Send Token to client
    token: token,
    data: {
      user: newUser,
    },
  });
});
