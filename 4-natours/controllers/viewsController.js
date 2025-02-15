const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');
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
    options: { sort: { createdAt: -1 } },
    fields: '_id review rating user',
  });

  console.log('Protecte Route LOGGED IN USER DATA:', req.user);
  console.log('tour.reviews valuse\n: ', tour.reviews);

  // console.log(
  //   `Currently OPENED Tour ID:${tour.id} Tour Name: ${tour.name} TOUR INFO: ${tour} `,
  // );

  // console.log('In viewController | getTour', req.user);

  // WE SHOULD CHECK IF WE HAVE TOUR OR NOT WHILE DISPLAYING EACH TOUR
  if (!tour) {
    return next(new AppError('There is no tour with that name!', 404));
  }

  // CHECK IF THE USER HAS ALREADY BOOKED THIS TOUR
  let hasBookedTour = false;
  let userReview = null;
  console.log('req.user._id', req.user._id);

  if (req.user) {
    const bookings = await Booking.find({ user: req.user.id }); // IF bookings EXISTS, IT MEANS THERE IS A BOOKING FOR THAT TOUR BY THE LOGGED IN USER.
    console.log('req.user.id', req.user.id);

    const bookedTourIds = bookings.map((booking) => booking.tour.id);
    console.log(
      '----Tour IDs Booked by user(bookedTourIds) ----\n',
      bookedTourIds,
    );
    // console.log(typeof tour.id);

    hasBookedTour = bookedTourIds.includes(tour.id.toString());

    // Improved user review finding:
    userReview = tour.reviews.find((review) => {
      if (review.user && review.user._id) {
        // Check if user and _id exist
        return review.user._id.toString() === req.user._id.toString();
      }
      return false; // Handle cases where review.user or review.user._id might be null/undefined
    });

    console.log('User review in viewsController:getTour', userReview);

    console.log(
      'Tour has been booked or not (true : booked | false : note booked):',
      hasBookedTour,
    );
  }

  // 2) Buld the template
  // 3) Render the template from the data we got for step 1

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
    hasBookedTour,
    userReview,
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

// My Bookings
exports.getMyTours = catchAsyncError(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id }).sort({
    createdAt: -1,
  });

  // 2) ?Find the tours with the returned IDs
  const tourIds = bookings.map((el) => el.tour.id);
  const tours = await Tour.find({
    _id: {
      $in: tourIds,
    },
  });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

// --------------- GET USER'S REVIEW ON BOOKED TOURS -----------------
exports.geMyReviews = catchAsyncError(async (req, res, next) => {
  // 1) Find all reviews by the current user, populate the tour details
  const reviews = await Review.find({ user: req.user.id }).populate({
    path: 'tour',
    select: 'name imageCover slug',
  });

  // 2) Render the 'my-reviews' template with the reviews data
  res.status(200).render('my-reviews', {
    title: 'My Reviews',
    reviews,
  });
});

exports.updateUserData = catchAsyncError(async (req, res, next) => {
  // console.log('UPDATING USER', req.body);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).render('accountTemplate', {
    title: 'Your account',
    user: updatedUser,
  });
});

// ADMIN ACCESS
exports.getManageTours = catchAsyncError(async (req, res, next) => {
  // Fetching tours with populated guide information
  const tours = await Tour.find()
    .sort({ createdAt: -1 })
    .select(
      'imageCover name startLocation duration difficulty ratingsAverage ratingsQuantity price summary createdAt startDates maxGroupSize slug',
    )
    .populate('guides', 'name');

  // Calculating the number of users who have booked each tour
  const toursWithBookings = await Promise.all(
    tours.map(async (tour) => {
      const bookingsCount = await Booking.countDocuments({ tour: tour._id });
      return { ...tour._doc, bookingsCount }; // Add bookingsCount to the tour data
    }),
  );

  // Rendering the page with the tours data, including bookings count
  res.status(200).render('manageTours', {
    title: 'Manage Tours',
    tours: toursWithBookings, // Pass toursWithBookings instead of tours
  });
});

// ADD TOUR
exports.getAddTourPage = catchAsyncError(async (req, res, next) => {
  // Fetch all users with roles 'guide' or 'lead-guide'
  const guides = await User.find({
    role: { $in: ['guide', 'lead-guide'] },
  }).select('_id name role');

  // Check if we are editing an existing tour
  let tour = null;
  if (req.params.id) {
    tour = await Tour.findById(req.params.id).populate('guides');
    if (!tour) {
      return next(new AppError('No tour found with that ID', 404));
    }
  }

  // Render the form page with the list of guides and tour data (if editing)
  res.status(200).render('addTour', {
    title: tour ? 'Edit Tour' : 'Add Tour',
    guides, // Pass the guides data to the template
    tour, // Pass the tour data if editing, otherwise null
  });
});

exports.getUpdateTourPage = catchAsyncError(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate({
    path: 'guides',
    select: '_id name role',
  });

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  console.log(
    'In viewsController.getUpdateTourPage, the tour selected is: ',
    tour,
  );

  const availiableGuides = await User.find({
    role: { $in: ['lead-guide', 'guide'] },
  }).select('name role _id');

  console.log('Availiable guides: ', availiableGuides);

  res.status(200).render('updateTour', {
    title: 'Update tour',
    tour,
    availiableGuides: availiableGuides || [],
  });
});

// MANAGE USERS PAGE RENDERING CONTROLLER
exports.getManageUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  // Sort users by role: user, guide, lead-guide, admin
  const sortedUsers = users.sort((a, b) => {
    const roleOrder = ['user', 'guide', 'lead-guide', 'admin'];
    return roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role);
  });

  res.status(200).render('manageUsers', {
    title: 'Manage Users',
    users: sortedUsers,
  });
});

exports.getAddUserPage = (req, res) => {
  res.status(200).render('addUser', {
    title: 'Add User',
    // adminEmail: req.user.email,
    // adminPassword: req.user.password,
  });
};

exports.getEditUserPage = catchAsyncError(async (req, res, next) => {
  const userToEdit = await User.findById(req.params.id);

  if (!userToEdit) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).render('editUser', {
    title: 'Edit User',
    userToEdit,
  });
});
