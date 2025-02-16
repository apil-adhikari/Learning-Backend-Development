const multer = require('multer');
const sharp = require('sharp');

const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsyncError = require('../utils/catchAsyncError');
const factory = require('./handleFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 6 },
]);

exports.resizeTourImages = catchAsyncError(async (req, res, next) => {
  console.log(req.files); // Debugging step
  console.log(req.body); // Debugging step
  if (!req.files.imageCover && !req.files.images) return next();

  // 1) Cover image
  if (req.files.imageCover) {
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${req.body.imageCover}`);
  }

  // 2) Images
  if (req.files.images) {
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/tours/${filename}`);

        req.body.images.push(filename);
      }),
    );
  }

  next();
});

exports.updateTour = catchAsyncError(async (req, res, next) => {
  // Parse the JSON data from the formData
  if (req.body.jsonData) {
    const jsonData = JSON.parse(req.body.jsonData);

    // Ensure the coordinates are in the correct format
    if (jsonData.startLocation && jsonData.startLocation.coordinates) {
      jsonData.startLocation.coordinates =
        jsonData.startLocation.coordinates.map(Number);
      jsonData.startLocation.type = 'Point'; // Add the type field
    }

    // Ensure each location has the type field
    if (jsonData.locations) {
      jsonData.locations = jsonData.locations.map((location) => ({
        ...location,
        type: 'Point',
      }));
    }

    // Merge the parsed JSON data into req.body
    req.body = { ...req.body, ...jsonData };
  }

  // Call the factory function to update the tour
  factory.updateOne(Tour)(req, res, next);
});

exports.createTour = factory.createOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.getAllTours = factory.getAll(Tour);

/** Middleware Function to manipulate query string help us to alias top 5 cheap tours
 * This middleware function prefill the parts of the query object before it reaches to getAllTours()
 */
exports.aliasTopTour = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

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

// Calculating distances between the specifitour location to other
exports.getDistances = catchAsyncError(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.0001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng',
        400,
      ),
    );
  }

  // Using GeoSpatial Aggregation
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: { distance: 1, name: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});
