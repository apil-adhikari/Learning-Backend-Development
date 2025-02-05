const Review = require('../models/reviewModel');
const catchAsyncError = require('../utils/catchAsyncError');
const factory = require('./handleFactory');

exports.getAllReviews = catchAsyncError(async (req, res, next) => {
  // Adding a nested GET endpoint. Here we get the all reviews of a tour if the tourId exists in the parameter(ie if  we use  nexted routes) else we get all reviews
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: `${reviews.length} reviews found.`,
    data: {
      reviews,
    },
  });
});

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// CREATE a review
exports.createReview = factory.createOne(Review);
// DELETE a review
exports.deleteReview = factory.deleteOne(Review);

// UPDATE a review
exports.updateReview = factory.updateOne(Review);
