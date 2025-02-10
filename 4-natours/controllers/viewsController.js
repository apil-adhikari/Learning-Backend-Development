const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsyncError = require('../utils/catchAsyncError');

exports.getOverview = catchAsyncError(async (req, res, next) => {
  // 1) Get all tour data from the collection
  const tours = await Tour.find();

  // 2) Build template
  // 3) Render the template using the tour data from step 1

  res.status(200).render('overview', {
    title: 'GhumGham',
    tours,
  });
});

exports.getTour = catchAsyncError(async (req, res, next) => {
  // 1) Get the data, for hte requested tour including reviews and tour guides
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  // WE SHOULD CHECK IF WE HAVE TOUR OR NOT WHILE DISPLAYING EACH TOUR
  if (!tour) {
    return next(new AppError('There is no tour with that name fdfdf!', 404));
  }

  // 2) Buld the template
  // 3) Render the template from the data we got for step 1

  res.status(200).render('tour', {
    title: `GhumGham | ${tour.name} Tour`,
    tour,
  });
});

// GET LOGIN FORM CONTROLLER
exports.getLoginForm = (req, res) => {
  // Set status and send render('template-name')
  res.status(200).render('login', {
    title: 'Log in to your account',
  });
};

// SIGNUP CONTROLLER
exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: `GhumGham | Signup`,
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('accountTemplate', {
    title: `Your account`,
  });
};
