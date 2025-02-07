const express = require('express');
const viewsController = require('../controllers/viewsController');
const authenticationController = require('../controllers/authenticationController');

const router = express.Router();

router.use(authenticationController.isLoggedIn);

router.get('/', viewsController.getOverview);

router.get('/tour/:slug', viewsController.getTour);

// LOGIN
router.get('/login', viewsController.getLoginForm);
module.exports = router;
