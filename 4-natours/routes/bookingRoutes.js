const express = require('express');
const bookingController = require('../controllers/bookingController');
const authenticationController = require('../controllers/authenticationController');

const router = express.Router();
router.get(
  '/checkout-session/:tourId',
  authenticationController.protect,
  bookingController.getCheckoutSession,
);
module.exports = router;
