const AppError = require('../utils/appError');

// Handling Cast to ObjectID failed (for example: Invalid Id)
const handleCastErrorDB = (err) => {
  console.log('Step 4: Handle Cast Error DB Function:');
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// Handling Duplicate Key Error
const handleDuplicateKeyErrorDB = (err) => {
  // const value = err.errorResponse.errmsg.match(/(['"])(.*?)\1/); // Match the duplicate key value inside quotes.
  // console.log(value); // Value is an array so we need to select the specific array index.
  const value = err.errorResponse.errmsg.match(/(['"])(.*?)\1/)[0];

  const message = `Duplicate field value: ${value} . Please use another value!`;
  return new AppError(message, 400);
};

// Handling Validation Error
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  console.log(errors.join('. '));

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const sendErrorForDevelopmentEnviornment = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    messsage: err.message,
    stack: err.stack,
  });
};

const sendErrorForProductionEnviornment = (err, res) => {
  // Operational Error: Trusted Errors: Send message to Client
  console.log('isOperational:', err.isOperational);
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      messsage: err.message,
    });
    // Programming Error or other unknown error: Don't leak error details
  } else {
    // 1) Console error
    console.error('ERROR 💣', err);

    // 2) Send a generic message

    res.status(500).json({
      status: 'error',
      // message: err,

      message: 'No Operational Error: Something went wrong!!!',
    });
  }
};

// GLOBAL ERROR HANDLER FUNCTION
module.exports = (err, req, res, next) => {
  console.log(
    'In Global Error Handler Middleware Function----------------------------',
  );

  // Step 1: Create Deep Clone of err object
  let error = JSON.parse(JSON.stringify(err));

  // Stack Trace
  //   console.log(err.stack);

  // Getting the status code: If status code is defined in error then use that status code or use 500 (internal server error) as default
  error.statusCode = error.statusCode || 500;
  // Getting the status: If there is status defined in error then use that error or use 'error' when there is 500 error statusCode as default
  error.status = error.status || 'error';

  // Sending Error Message during Development and Production Enviornment:
  if (process.env.NODE_ENV === 'development') {
    console.log(
      'Step 3: In sendErrorForDevelopmentEnviornment 🧑‍💻----------------------------',
    );

    sendErrorForDevelopmentEnviornment(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    // Making hard copy of err object
    // let error = { ...err };
    // console.log('Name from Original err Object:', err.name);
    // console.log('Name from Hard Copied error Object:', error.name);
    // console.log(error.name);

    console.log(
      'In sendErrorForProductionEnviornment-----------------------------',
    );

    // Handle Cast to ObjectID

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }

    // console.log('Error Before handling duplicate key error:', error);
    // Handle Duplicate Key Error
    if (error.code === 11000) {
      error = handleDuplicateKeyErrorDB(error);
    }

    // Handle Validation Error
    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }

    // Call function to send error when in production enviornment
    sendErrorForProductionEnviornment(error, res);
  }
};
