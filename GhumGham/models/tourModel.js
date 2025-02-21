const mongoose = require('mongoose');
const sluify = require('slugify');
const validator = require('validator');
// const User = require('./userModel');

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
      maxLength: [40, 'A tour name must have less or equal then 40 characters'],
      minLength: [10, 'A tour name must have more or equal to 10 characters'],
      // validate: [
      // validator.isAlpha,
      //   'Tour name must only contain characters or letters',
      // ],
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, //4.66666, 4.6 =>46.666 =>47/10 => 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          // this only points to current doc on NEW document creation but not on update
          return value < this.price;
        },
        message: 'Disount price ({VALUE}) should be below the regular price',
      },
    },
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
      // required: [true, 'A tour must have an cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: { type: Boolean, default: false },

    // START LOCATIONS AND LOCATIONS IN GENERAL(Geospatial data)
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: { type: [Number], required: true }, // longitude first and latitude second
      address: String,
      description: String,
    },

    // Locations is embedded document
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],

    // REFERENCE TO USER for guides
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
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

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

// Defining Virtual Properties (define on Schema)
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual Populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour', // Field that we are storing the review
  localField: '_id',
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

// Embedding
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

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

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });

  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds! `);
  // console.log(docs);
  next();
});

// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

//   // console.log(this.pipeline());
//   next();
// });

// Creating a model out of our Schema
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
