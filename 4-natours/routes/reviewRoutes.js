const express = require('express');

const reviewController = require('../controllers/reviewController');
const authenticationController = require('../controllers/authenticationController');

const router = express.Router({
  mergeParams: true,
});

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authenticationController.protect,
    authenticationController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
