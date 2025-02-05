const Review = require('../models/reviewModel');
const catchAsyncError = require('../utils/catchAsyncError');

exports.getAllReviews = catchAsyncError(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: 'success',
    results: `${reviews.length} reviews found.`,
    data: {
      reviews,
    },
  });
});

// CREATE a review
exports.createReview = catchAsyncError(async (req, res, next) => {
  const newReview = await Review.create({
    review: req.body.review,
    rating: req.body.rating,
    tour: req.body.tour,
    user: req.body.user,
  });

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});
