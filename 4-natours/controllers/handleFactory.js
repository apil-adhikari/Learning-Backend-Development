const APIFeatures = require('../utils/apiFeatures');
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

exports.updateOne = (Model) =>
  catchAsyncError(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsyncError(async (req, res, next) => {
    const newDocument = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: newDocument,
      },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsyncError(async (req, res, next) => {
    // const document = await Model.findById(req.params.id).populate('reviews');
    // Insted of directly chaining the populate, we first create a query and later check if there is populateOptions if it is there we chatin it to query and later we do await.

    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);

    const document = await query;

    // We can use populate before all query starting with find, so we use query middleware do so
    // .populate({
    //   path: 'guides',
    //   select: '-__v -passwordChangedAt',
    // }); // the populate() will fill there reference wehave given with the data but only in the query.
    console.log(document);
    // Tour.findOne({_id: req.params.id}) USING FILTER OBJECT & returns only one document

    // CHECK IF document EXISTS, If does not, then use AppError class to generate error message and status code.
    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsyncError(async (req, res, next) => {
    // To allow for nested GET reviews on tour (samll hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const document = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      // Sending no of results we have since its an array we can count the length of that array.
      results: `${document.length} results found`,
      // Envolope for our data
      data: {
        // url's endpoint: send the data that we need to send as response
        data: document,
      },
    });
  });
