const fs = require('fs');
const Tour = require('../models/tourModel');

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

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();

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
