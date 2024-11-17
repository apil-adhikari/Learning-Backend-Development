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

const port = process.env.PORT || 3000;
console.log(port);
app.listen(port, () => {
  console.log(`Our App is running in the port ${port}.`);
});
