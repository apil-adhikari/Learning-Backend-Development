const mongoose = require('mongoose');

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
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
});

// Creating a model out of our Schema
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
