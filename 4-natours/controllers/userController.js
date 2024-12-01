// Local Modules
const User = require('../models/userModel');
const catchAsyncError = require('../utils/catchAsyncError');

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    // Sending no of results we have since its an array we can count the length of that array.
    results: `${users.length} results found`,
    // Envolope for our data
    data: {
      // url's endpoint: send the data that we need to send as response
      users: users,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
