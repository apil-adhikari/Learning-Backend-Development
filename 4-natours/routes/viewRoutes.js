const express = require('express');
const viewsController = require('../controllers/viewsController');
const authenticationController = require('../controllers/authenticationController');

const router = express.Router();

// SIGNUP
router.get('/signup', viewsController.getSignupForm);

// LOGIN
router.get('/login', viewsController.getLoginForm);

router.use(authenticationController.isLoggedIn);

router.get('/', viewsController.getOverview);

router.get('/tour/:slug', viewsController.getTour);

module.exports = router;
