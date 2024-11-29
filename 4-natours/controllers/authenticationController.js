// Start of MODULES

// Local Modules
const User = require('../models/userModel');
const catchAsyncError = require('../utils/catchAsyncError');

// End of MOUDLES

exports.signup = catchAsyncError(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});
