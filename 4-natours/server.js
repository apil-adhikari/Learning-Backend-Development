// Require MONGOOSE package
const mongoose = require('mongoose');

const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// Importing Express application
const app = require('./app');
// console.log(process.env.NODE_ENV);
// console.log(app.get('env'));

// DATABASE CONNECTION PROCESS
// Replace the placeholder with the actual password
const DB = process.env.DATABASE.replace(
  '<DB_PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// Connect to DataBase
mongoose
  .connect(
    DB,
    //   {
    //   useNewUrlParser: true,
    //   useCreateIndex: true,
    //   useFindAndModify: false,
    // }
  )
  .then(() => {
    // console.log(con.connections); // Logs all mongoose instance
    console.log('DataBase connection successful!');
  });

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

const port = 3000 || process.env.PORT;
app.listen(port, () => {
  console.log(`Our App is running in the port ${port}.`);
});
