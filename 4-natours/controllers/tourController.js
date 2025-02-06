const Tour = require('../models/tourModel');
// const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsyncError = require('../utils/catchAsyncError');
const factory = require('./handleFactory');

//NOTE: Reading FILE from file based API
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

/**
 * Create a checkBody Middleware
 * Check if body contains the name and price property
 * If not, send back 400 (bad request) Add it to post handler stack
 */
// exports.checkBody = (req, res, next) => {
//   const name = req.body.name;
//   const price = req.body.price;
//   if (!name || !price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Invalid request from the client. Missing name or price',
//     });
//   }
//   next();
// };

/** Middleware Function to manipulate query string help us to alias top 5 cheap tours
 * This middleware function prefill the parts of the query object before it reaches to getAllTours()
 */
exports.aliasTopTour = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// GET all tours using factory function
exports.getAllTours = factory.getAll(Tour);

// exports.getAllTours = catchAsyncError(async (req, res, next) => {
//   // EXECUTE QUERY
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const tours = await features.query;

//   // SEND RESPONSE
//   res.status(200).json({
//     status: 'success',
//     // Sending no of results we have since its an array we can count the length of that array.
//     results: `${tours.length} results found`,
//     // Envolope for our data
//     data: {
//       // url's endpoint: send the data that we need to send as response
//       tours: tours,
//     },
//   });
// });

/** METHOD POST: CREATE a new TOUR
 * 1) Use Tour.create({}) method to create a new data.
 * 2) Create a new tour based on the data that comes from the body of the request. ie req.body
 * 3) .create() method returns a promise so we handle the promise using async-awiat.
 * 4) We accept the data in new variable newTour and this will have newly created tour with upto date id.
 * 5) We also need to handle the error, we can use simple try{} cathc(){} block to handle the error, later use seprate module to handle error for our application.
 */

// Function wrapping async function
// const catchAsyncError = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch((err) => next(err));
//   };
// };

exports.createTour = factory.createOne(Tour);
// exports.createTour = catchAsyncError(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   });
// });

exports.updateTour = factory.updateOne(Tour);

// exports.updateTour = catchAsyncError(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: tour,
//     },
//   });
// });

exports.deleteTour = factory.deleteOne(Tour);

// exports.deleteTour = catchAsyncError(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

exports.getTour = factory.getOne(Tour, {
  path: 'reviews',
});

// exports.getTour = catchAsyncError(async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id).populate('reviews');
//   // We can use populate before all query starting with find, so we use query middleware do so
//   // .populate({
//   //   path: 'guides',
//   //   select: '-__v -passwordChangedAt',
//   // }); // the populate() will fill there reference wehave given with the data but only in the query.
//   console.log(tour);
//   // Tour.findOne({_id: req.params.id}) USING FILTER OBJECT & returns only one document

//   // CHECK IF tour EXISTS, If does not, then use AppError class to generate error message and status code.
//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: tour,
//     },
//   });
// });

/**
 * Handler Function for Aggregation Pipeline (MongoDB Feature)
 *
 * Purpose:
 * - Calculate statistics for tours using the Mongoose Driver.
 * - Utilize aggregation stages and operators to perform efficient data analysis.
 *
 * MongoDB References (v8.0):
 * - Aggregation Overview: https://www.mongodb.com/docs/manual/aggregation/
 * - Aggregation Pipeline: https://www.mongodb.com/docs/manual/core/aggregation-pipeline/
 * - Aggregation Stages: https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/
 * - Aggregation Operators: https://www.mongodb.com/docs/manual/reference/operator/aggregation/
 */

exports.getTourStats = catchAsyncError(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        totalNumberOfTours: { $sum: 1 },
        totalNumberOfRatings: { $sum: '$ratingsQuantity' },
        averageRating: { $avg: '$ratingsAverage' },
        averagePrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { averagePrice: 1 },
    },
    // { stages can be repeated
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

/**No Tours according to the months */
exports.getMonthlyPlan = catchAsyncError(async (req, res, next) => {
  const year = req.params.year * 1; // 2021

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numberOfTourStartingInThisMonth: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numberOfTourStartingInThisMonth: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    total: plan.length,
    status: 'success',
    data: {
      plan,
    },
  });
});

// '/tour-within/:distance/center/:latlng/unit/:unit'
// /tours-within?distance=20&center=-40,45&unit=km => using query stiring not a good way to specify
// /tours-within/20/center/34.238300, -118.682336/unit/km

// getToursWithin
exports.getToursWithin = catchAsyncError(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  // Radius of sphere in Radians
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng',
        400,
      ),
    );
  }
  // console.log(distance, lat, lng, unit);

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});
