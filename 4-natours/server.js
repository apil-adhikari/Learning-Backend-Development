// Require MONGOOSE package
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Handling Uncaught Exception:
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception! 💥, Shutting down ...');
  // console.log(err);
  console.log(err.name, err.message);

  // Shutting Down
  process.exit(1); // We really need to crash our application. Node app is in unclean state during this time.
});

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
const server = app.listen(port, () => {
  console.log(`Our App is running in the port ${port}.`);
});

// Handling Unhandled Rejections:
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection! 💥, Shutting down ... ');

  // Shutting Down Gracefully
  server.close(() => {
    process.exit(1);
  });
});

// Test for Uncaught Exceptions
// console.log(x);
