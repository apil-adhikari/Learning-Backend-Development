const AppError = require('../utils/appError');
const catchAsyncError = require('../utils/catchAsyncError');

/**
 * handleFactory
 * This is used to delete the document from each collection
 */
exports.deleteOne = (Model) =>
  catchAsyncError(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
