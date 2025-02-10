const multer = require('multer');

// Local Modules
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsyncError = require('../utils/catchAsyncError');
const factory = require('./handleFactory');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    // user-id949038fdf9-543534435.jpeg
    const imgFileExtension = file.mimetype.split('/')[1];
    cb(null, `${req.user.id}-${Date.now()}.${imgFileExtension}`);
  },
});

// MULTER FILTER
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image. Please upload only images.', 400), false);
  }
};

// MULTER SETTINGS
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uplodUserPhoto = upload.single('photo');

// function to filter req.body data to include only name and email
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// ACTIONS PERFORMED BY A LOGGED IN USER  --------------------------------------------------------
// 1) GET THE PROFILE INFORMATION BY A LOGGED IN USER(such as email password, photos, etc.)
exports.getMe = (req, res, next) => {
  // We set the req.params.id to req.user.id(which is a logged in user) to get the details. req.user.id is passed from .protect() when a user is logged in. So now we can user factory function to allow the user get the details of himself.
  req.params.id = req.user.id;
  next();
};

// UPDATE user data by LOGGED IN USER(WE DO NOT ALLOW UPDATING PASSWORD FROM THIS).
exports.updateMe = catchAsyncError(async (req, res, next) => {
  // console.log(req.file);
  // console.log(req.body);

  /**
   * 1) Create error if user POSTs password data
   * 2) Update user document
   */
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400,
      ),
    );
  }

  // ACTAULLY UPDATE USER DATA( ONLY NAME AND EMAIL) BY A LOGGED IN USER ------------

  // Filter our unwanted fields that are not allowed to be udpated. We want only the name and email fileds to be updated.

  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  }); // findByIdAndUpdate doesnot run any validators since we need to update the fields other than password so we can use this.

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// DELETING USER BY HIMSELF(LOGGED IN USER) ------------
exports.deleteMe = catchAsyncError(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false }); // we can set the active to false

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// END OF ACTIONS TO ALLOWED TO BE PERFORMED BY A LOGGED IN USER --------------------------------------------------------

// GET ALL USERS USING FACTORY FUNCTION (BY ADMIN) --------------
exports.getAllUsers = factory.getAll(User);

// exports.getAllUsers = catchAsyncError(async (req, res, next) => {
//   const users = await User.find();

//   // SEND RESPONSE
//   res.status(200).json({
//     status: 'success',
//     // Sending no of results we have since its an array we can count the length of that array.
//     results: `${users.length} results found`,
//     // Envolope for our data
//     data: {
//       // url's endpoint: send the data that we need to send as response
//       users: users,
//     },
//   });
// });

// /createUser IS NOT FOR CREATING A USER BUT USE NEED TO USER /signup ------------
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please user /signup instead.',
  });
};

// GET A USER ----------------------
exports.getUser = factory.getOne(User);

// exports.getUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!',
//   });
// };

// Do  NOT update password with THIS ------(BECAUSE IT DOESNOT RUN THE VALIDATORS AND OTHER MIDDLEWARE AND HOOKS THAT IS NEEDED TO BE RUNED BEFORE UPDATING PASSWORD)
exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
