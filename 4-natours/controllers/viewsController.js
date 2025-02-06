const Tour = require('../models/tourModel');
const catchAsyncError = require('../utils/catchAsyncError');

exports.getOverview = catchAsyncError(async (req, res, next) => {
  // 1) Get all tour data from the collection
  const tours = await Tour.find();

  // 2) Build template

  // 3) Render the template using the tour data from step 1

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'Tour Title',
  });
};
