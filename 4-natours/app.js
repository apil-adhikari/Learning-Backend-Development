const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Creating an instance of the express function by initilizing express to app variable
const app = express();

// MIDDLEWARES
app.use(morgan('dev'));

// MIDDLEWARE .use() method to use middleware
// Middleware for reading request body data
app.use(express.json()); // Helps to parse the request data

// Custom Middleware

app.use((req, res, next) => {
  // This get applied to all the requests as we haven't specified in the routing, which is also known as Global Middleware
  console.log('Hello from the middleware, CUSTOM MIDDLEWARE 1 👋');

  // Call next() when using middleware
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTING Syntax: app.method('path or endpoint', handlerFunction)

// ROUTE: get();
// app.get('/', (req, res) => {
//   // Send data back
//   res
//     .status(200)
//     // when using .json() to response to the request, it sets the Content-Type to application/json by default. We don't have to manually specify the content type. Which makes our life a little bit easier.
//     // .send() method only sends string back to the client. We can also send json data back to the client.
//     .json({
//       message: 'Hello from the server side.',
//       application: 'Natours',
//     });
//   // .send('Hello from the server side.');
// });

// app.post('/', (req, res) => {
//   res.send(
//     'We can post to this endpoint, we need the matching url and the matching HTTP method to that url endpoint'
//   );
// });

// -------Starting API Handling GET Requests
/**
 * 1) It is important to give version number to our api as later we can update it without deploying it in the real world eg: '/api/v1/tours' -> ADD SOME FEATTURES => UPDATE IN 'api/v2/tours'-> later rollout to the live enviornment.
 * 2) Reading the data, we use fs core module. Since the data that we read is in json format, we need to parse it so that json data is conveted in to JS object.
 *
 *
 *
 */

// ROUTE HANDLERS
// Refactoring ROUTES (By seprating Request Handler Function)

// Routing
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);
// app.get('/api/v1/tours/:id', getTour);

// ROUTES
// Updated Routing: Chaining the Routes using app.route()

// Creating and Mounting Multiple Routers

// Tours Route
// Creating Routers

// 3) ROUTES
// Connecting new Router with our Application(we use middleware)
// Mounting Routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
