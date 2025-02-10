const express = require('express');
const viewsController = require('../controllers/viewsController');
const authenticationController = require('../controllers/authenticationController');

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
  authenticationController.isLoggedIn,
  viewsController.getOverview,
);

// GET A TOUR
router.get(
  '/tour/:slug',
  authenticationController.isLoggedIn,
  viewsController.getTour,
);

// GET ACCOUNT DETAILS
router.get('/me', authenticationController.protect, viewsController.getAccount); // Protected routed(only logged in user will have access to this route.)

router.post(
  '/submit-user-data',
  authenticationController.protect,
  viewsController.updateUserData,
);

module.exports = router;
