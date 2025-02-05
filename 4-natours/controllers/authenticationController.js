// Start of MODULES
const { promisify } = require('util');

// 3rd Party Modules
const jwt = require('jsonwebtoken');

// Local Modules
const User = require('../models/userModel');
const catchAsyncError = require('../utils/catchAsyncError');
const AppError = require('../utils/appError');

// End of MOUDLES

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

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
    passwordChangedAt: req.body.passwordChangedAt,
  });

  try {
    // Create Token and Log In user as soon as they sign up
    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token: token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    // If token creation fails, deleting the resently created new user:
    await User.findByIdAndDelete(newUser._id);
    // We should pass error to global error handler function:
    next(err);
  }
});

/** LOGIN
 * Steps:
 * First, Read email and password from body.
 * Second, 1) Chekc if email and password exists
 *         2) Check if user exists for that email and password is correct
 *         3) Compare password in DB(encrypted) vs password user entered. [Use bcrypt]
 *         3) If everything is ok, send token to client
 */
exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Chekc if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists for that email and password is correct
  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.verifyPassword(password, user.password))) {
    return next(new AppError('Incorrect Email or Passsword ', 401));
  }

  console.log(user);

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token: token,
  });
});

/**MIDDLEWARE FUNCTION TO PROTECT ROUTES
 * STEPS:
 * 1) Getting the tokens and checking if its there (if it exists.)
 * 2) Validate the token(#VeryImportant Step) where we veriyt the token
 * 3)Check if user still exists
 * 4) Check if user changed the password after the token was issued.
 */
exports.protect = catchAsyncError(async (req, res, next) => {
  let token;
  // Get the token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // console.log('TOKEN in Authorization Header: ', token);

  // Check if the token exists?
  if (!token) {
    return next(
      new AppError('You are not logged in! Please login to get access', 401),
    );
  }

  // 2) Verify the token[Check if the payload is changed]
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  // 3) Check if the user exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this user does no loger exists.',
        401,
      ),
    );
  }

  // 4) Check if the user has changed the password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401),
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
