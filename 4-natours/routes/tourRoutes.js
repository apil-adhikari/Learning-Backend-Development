const express = require('express');
const tourController = require('../controllers/tourController');
const authenticationController = require('../controllers/authenticationController');
const reviewRouter = require('./reviewRoutes');

/** STEP TO CREATE ROUTER
 * 1) Create a router using express.Router();
 * 2) Use router to route and call the handler functions based on route
 * 3) Chain the Routes using app.route('endpoint').method(requestHandlerFunction)
 * 4) Export the router and use in the main route
 */
const router = express.Router();

// POST /tour/2334fad/reviews ->create a tour review by a currenlty logged in user
// GET /tour/2334fad/reviews -> get reviews of all tours
// GET /tour/234fad/reviews/434fgs -> get the spcifice review

// router
//   .route('/:tourId/reviews')
//   .post(
//     authenticationController.protect,
//     authenticationController.restrictTo('user'),
//     reviewController.createReview,
//   );

router.use('/:tourId/reviews', reviewRouter);

// router.param('id', tourController.checkID);

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
    tourController.updateTour,
  )
  .delete(
    authenticationController.protect,
    authenticationController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = router;
