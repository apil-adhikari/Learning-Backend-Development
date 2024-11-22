const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

//NOTE: Reading FILE from file based API
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

/**
 * Create a checkBody Middleware
 * Check if body contains the name and price property
 * If not, send back 400 (bad request) Add it to post handler stack
 */
exports.checkBody = (req, res, next) => {
  const name = req.body.name;
  const price = req.body.price;
  if (!name || !price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid request from the client. Missing name or price',
    });
  }
  next();
};

/** Middleware Function to manipulate query string help us to alias top 5 cheap tours
 * This middleware function prefill the parts of the query object before it reaches to getAllTours()
 */
exports.aliasTopTour = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // console.log(req.query);

    //  BUILD QUERY
    // 1A) Filtering
    // const queryObject = { ...req.query }; // Creating a hard copy of the query object (Using destructuring and creating new object)

    // const excludeFields = ['page', 'sort', 'limit', 'fields'];
    // // COMMENT: Removing the fields from the query object
    // excludeFields.forEach((el) => delete queryObject[el]);

    // // 2B) Advanced Filtering
    // let queryString = JSON.stringify(queryObject);
    // queryString = queryString.replace(
    //   /\b(gte|gt|lte|lt)\b/g,
    //   (match) => `$${match}`,
    // );

    // // REFERENCE TO HOW TO ADD THE MONGOOSE OPERATOR :::: So Replace gte,gt,lte,lt with $gte,$gt,$lte,$lt using regular expression
    // //MONGOOSE OPERATOR:    { difficulty: 'easy', duration: {$gte: 5}}
    // //LOGGING OF req.query: { difficulty: 'easy', duration: { gte: '5' } }

    // let query = Tour.find(JSON.parse(queryString)); // We do not directly await this. If we do so, we can't use the properties of excludeFields later on

    // // 2) Sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    //   // sort('price ratingsAverage)
    // } else {
    //   query = query.sort('-createdAt');
    // }

    // // 3) Field Limiting
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    // Pagination (using Page, Limit, Skip)
    // const page = req.query.page * 1 || 1;
    // const perPage = req.query.limit * 1 || 100;
    // const skip = (page - 1) * perPage;

    // query = query.skip(skip).limit(perPage);

    // if (req.query.page) {
    //   const numberOfTours = await Tour.countDocuments();
    //   if (skip >= numberOfTours) throw new Error('This page does not exist.');
    // }

    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();

    const tours = await features.query;
    console.log(tours);

    // Way 2: Chaining special mongoose methods
    // const query =  Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      // Sending no of results we have since its an array we can count the length of that array.
      results: `${tours.length} results found`,
      // Envolope for our data
      data: {
        // url's endpoint: send the data that we need to send as response
        tours: tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

/** METHOD POST: CREATE a new TOUR
 * 1) Use Tour.create({}) method to create a new data.
 * 2) Create a new tour based on the data that comes from the body of the request. ie req.body
 * 3) .create() method returns a promise so we handle the promise using async-awiat.
 * 4) We accept the data in new variable newTour and this will have newly created tour with upto date id.
 * 5) We also need to handle the error, we can use simple try{} cathc(){} block to handle the error, later use seprate module to handle error for our application.
 */

exports.createTour = async (req, res) => {
  try {
    // Traditional way of CREATING & SAVING new tour
    // const newTour = new Tour({});
    // newTour.save();

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
      // 'Error: Invalid Data Send. (NOTE: Do not send this error message in real application, send meaningfull error message to the client',
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({_id: req.params.id}) USING FILTER OBJECT & returns only one document

    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }

  // Finding if the requested ID exists. (Implemented in Param Middleware above checkID)
  // if (id > tours.length) { // If the ID doesnot exsist, then there is no tour.
  // if (!tour) {
  //   // If there is no tour(undefined) its invalid
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }
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

exports.getTourStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
