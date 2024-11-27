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

  res.status(err.statusCode).json({
    status: err.status,
    messsage: err.message,
  });
};
