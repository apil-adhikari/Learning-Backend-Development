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
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      messsage: err.message,
    });
    // Programming Error or other unknown error: Don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💣', err);

    // 2) Send a generic message

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

/** Global Error Hanlder Function
 * * Seprating global error handler function
 */
module.exports = (err, req, res, next) => {
  // Stack Trace
  //   console.log(err.stack);

  // Getting the status code: If status code is defined in error then use that status code or use 500 (internal server error) as default
  err.statusCode = err.statusCode || 500;
  // Getting the status: If there is status defined in error then use that error or use 'error' when there is 500 error statusCode as default
  err.status = err.status || 'error';

  // Sending Error Message during Development and Production Enviornment:
  if (process.env.NODE_ENV === 'development') {
    sendErrorForDevelopmentEnviornment(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorForProductionEnviornment(err, res);
  }
};
