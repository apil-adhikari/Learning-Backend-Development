const express = require('express');
const tourController = require('../controllers/tourController');
const authenticationController = require('../controllers/authenticationController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTour, tourController.getAllTours);

router
  .route('/tour-stats')
  .get(
    authenticationController.protect,
    authenticationController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getTourStats,
  );

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authenticationController.protect,
    authenticationController.restrictTo('admin', 'lead-guide'),
    tourController.createTour,
  );

router
  .route('/:id')
  .get(authenticationController.protect, tourController.getTour)
  .patch(
    authenticationController.protect,
    authenticationController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour,
  )
  .delete(
    authenticationController.protect,
    authenticationController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = router;
