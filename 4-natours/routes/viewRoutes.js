const express = require('express');
const viewsController = require('../controllers/viewsController');
const authenticationController = require('../controllers/authenticationController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// SIGNUP
router.get(
  '/signup',
  authenticationController.isLoggedIn,
  viewsController.getSignupForm,
);

// LOGIN
router.get(
  '/login',
  authenticationController.isLoggedIn,
  viewsController.getLoginForm,
);

// GET TOURS OVERVIEW PAGE
router.get(
  '/',
  bookingController.createBookingCheckout,
  authenticationController.isLoggedIn,
  viewsController.getOverview,
);

// GET A TOUR
router.get(
  '/tour/:slug',
  authenticationController.protect,
  authenticationController.isLoggedIn,
  viewsController.getTour,
);

// GET ACCOUNT DETAILS
router.get('/me', authenticationController.protect, viewsController.getAccount); // Protected routed(only logged in user will have access to this route.)
router.get(
  '/my-tours',
  authenticationController.protect,
  viewsController.getMyTours,
);

// ROUTE FOR /MY REVIEWS
router.get(
  '/my-reviews',
  authenticationController.protect,
  viewsController.geMyReviews,
);

router.post(
  '/submit-user-data',
  authenticationController.protect,
  viewsController.updateUserData,
);

// ADMIN ACCESS ROUTES
// router.use(authenticationController.protect);
// router.use(authenticationController.restrictTo('admin'));

router.get(
  '/manage-tours',
  authenticationController.protect,
  authenticationController.restrictTo('admin'),
  viewsController.getManageTours,
);

// END OF ADMIN ACCESS ROUTES

module.exports = router;
