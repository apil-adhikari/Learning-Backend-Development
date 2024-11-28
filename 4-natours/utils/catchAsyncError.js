// Catch Asynchronous Error:
module.exports = (fn) => (req, res, next) => {
  console.log(
    'Step 1: Catching Async Errors------------------------------------',
  );
  fn(req, res, next).catch((err) => next(err));
};
