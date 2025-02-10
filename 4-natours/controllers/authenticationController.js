// Start of MODULES
const crypto = require('crypto');
const { promisify } = require('util');

// 3rd Party Modules
const jwt = require('jsonwebtoken');

// Local Modules
const User = require('../models/userModel');
const catchAsyncError = require('../utils/catchAsyncError');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

// End of MOUDLES

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

/**This will call signToken and also send the response with dynamic static codes passed in the function. */
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true, // Cookies cannot be accessed or modified by the browser's JavaScript
  };

  // In production, ensure cookies are only sent over HTTPS
  if (process.env.NODE === 'production') cookieOptions.secure = true; // Cookies will be sent over encrypted connection such as https only in production enviornment

  res.cookie('jwt', token, cookieOptions);

  // Remove the password form the output. Not sending the password even when creating a new user ie. we should hide the password.
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token: token,
    data: {
      user,
    },
  });
};

// SIGNUP CONTROLLER
exports.signup = catchAsyncError(async (req, res, next) => {
  console.log('IN signup');
  // Sanitize and only allow the required fields from the request body
  const { name, email, password, passwordConfirm, role } = req.body;

  // // Only allow 'user' or 'guide' roles, default to 'user' if role is not specified or is invalid
  // const sanitizedRole = ['user', 'guide', 'lead-guide', 'admin'].includes(role)
  //   ? role
  //   : 'user';

  // // Check if email already exists in the database (duplicate key error handling)
  // const existingUser = await User.findOne({ email });
  // if (existingUser) {
  //   return next(
  //     new AppError(
  //       'Email already exists! Please login or use a different email.',
  //       400,
  //     ),
  //   );
  // }

  // Create new user with the necessary fields
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    passwordChangedAt: undefined, // Don't allow the client to set this field
    role,
    // role: sanitizedRole, // Use the sanitized role value
  });

  const url = `${req.protocol}://${req.get('host')}/me`;
  console.log(url);
  await new Email(newUser, url).sendWelcome();

  // Send token and respond
  createSendToken(newUser, 201, res);
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
  console.log('-------------------IN LOGIN ----------------');
  const { email, password } = req.body;
  console.log(email, password);

  // 1) Chekc if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists for that email and password is correct
  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.verifyPassword(password, user.password))) {
    return next(new AppError('Incorrect Email or Passsword ', 401));
  }

  console.log('USER DATA AFTER LOGIN:::\n', user);
  createSendToken(user, 200, res);
});

// LOGOUT
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
  });
};

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
    // Also setting the cookie as jwt if there is no authorization came in header
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
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
  console.log('--------------In protect()-------------');
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
  res.locals.user = currentUser;
  next();
});

// Only for rendered pages, no errors.
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies && req.cookies.jwt) {
    try {
      // 2) Verify the token[Check if the payload is changed]
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );
      console.log(
        '-------------In isLoggedIn| DECODED DATA-------- :\n',
        decoded,
        '\n-----------------',
      );

      // 2) Check if the user exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 4) Check if the user has changed the password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // There is a logged in user (we pass the currentUser to res.locals which is accessible to our pug template)
      res.locals.user = currentUser;
      return next();
    } catch (error) {
      return next();
    }
  }
  next();
};

// AUTHORIZATION using user roles and setting permissions
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    // roles ['admin','lead-guide']✔️ but role='user'❌ doesnot have access
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action!', 403),
      );
    }

    next();
  };

exports.forgetPassword = catchAsyncError(async (req, res, next) => {
  // 1) Get user based on the POSTed email
  const user = await User.findOne({ email: req.body.email });
  console.log(user);
  if (!user) {
    return next(new AppError('There is no user with that email address.', 404));
  }

  // 2) Generate the random token
  const resetToken = user.createPasswordResetToken();
  await user.save({
    validateBeforeSave: false,
  });

  // 3) Send it back as an email
  try {
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    // console.log(`Reset URL: ${resetURL}`);

    await new Email(user, resetURL).sendPasswordReset();

    // console.log('inside try block of forgot password.');
    res.status(200).json({
      status: 'success',
      message: 'Token send to email!',
    });
  } catch (err) {
    // console.error('Error sending email:', err.message);

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({
      validateBeforeSave: false,
    });
    return next(
      new AppError(
        'There was an error sending the email. Try again lager.',
        500,
      ),
    );
  }
});

// PASSWORD RESET
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  // 1) Get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  // 2) It token has not expired and there is a user, we set new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired!', 400));
  }

  // We get the password and passwordConfirm
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save(); // /we need validator for this time.

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, by send JWT to client
  createSendToken(user, 200, res);
});

// UPDATE PASSWORD (this will allow the logged in user to update their password.)
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  // 1) Get the user form the collection
  const user = await User.findById(req.user.id).select('+password'); // this is availiable form the middleware wher we pass user in req.user

  // 2) Check if the POSTed password is correct
  if (!(await user.verifyPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrontg.', 401));
  }
  // 3) If so, update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will not work as intended!!!

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});
