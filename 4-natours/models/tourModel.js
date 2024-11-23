const mongoose = require('mongoose');
const sluify = require('slugify');

/**
 * Creating a Simple Tour Model
 * Step 1: SCHEMA: We need to create a schema before creating model.
 * using new mongoose.Schema({})
 * Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
 * Step 2: Schema Type:
 * We can think of a Mongoose schema as the configuration object for a Mongoose model. A SchemaType is then a configuration object for an individual property. A SchemaType says what type a given path should have, whether it has any getters/setters, and what values are valid for that path.
 * Step 3: Create a model out of the schema
 */

// Creating tour schema(blueprint for tour data) with SchemaType
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have an cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: { type: Boolean, default: false },
  },
  // Defining additional Schema Options to display the virtual properties each time data is outputed as JSON or as an Object. ie. we want virtuals to be the part of output.
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

// Defining Virtual Properties (define on Schema)
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

/**
 * Mongoose Middlewares
 * 1) Document Middleware: Runs before .save() and .create() but not on .insertMany()
 * * We can have middlewares running before and after the event happned
 * * In case of DOCUMENT middleware, that event is usually 'save' event
 * * Middleware function has access to 'this' keyword which refers to the current document.
 * * To use 'this' keyword, we need to use regular JavaScript function (no arrow function allowed)
 * * There can be multiple pre and post hooks.
 * * In pre hook, we have access to 'next' as function argument.
 * * In post hook, we have access to recently saved document & next.
 * * 'save' middleware only runs for .save() and .create() mongoose method & doesnot run for .insertMany() and findOneAndUpdate() or .findByIdAndUpdate()
 **/

tourSchema.pre('save', function (next) {
  this.slug = sluify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', (next) => {
//   console.log('Will save document');
//   next();
// });

// tourSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next();
// });

// 2. QUERY MIDDLEWARE
// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();

  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds! `);
  // console.log(docs);
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  console.log(this.pipeline());
  next();
});

// Creating a model out of our Schema
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
