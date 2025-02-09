const path = require('path');

const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSalitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/globalErrorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

// Creating an instance of the express function by initilizing express to app variable
const app = express();

// Setting View Engine as Pug
app.set('view engine', 'pug');

// Location of views(templates)
app.set('views', path.join(__dirname, 'views'));

// GLOBAL MIDDLEWARES]
app.use(express.urlencoded({ extended: true }));
// MIDDLEWARE .use() method to use middleware
// Middleware for reading request body data
app.use(
  express.json({
    limit: '10kb', // This will limit the size of request body
  }),
); // Helps to parse the request data

// USING cookie-parser: It will parse the data from the cookie
app.use(cookieParser());

// Serving static file using builtin middleware
app.use(express.static(path.join(__dirname, 'public')));

// HELMET Middleware to set security headers in our express app. This should be kept at at the top
// app.use(helmet());

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          'https://cdn.jsdelivr.net',
          "'unsafe-inline'",
          "'unsafe-eval'",
        ],
        styleSrc: ["'self'", 'https://fonts.googleapis.com'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: [
          "'self'",
          'https://cdn.jsdelivr.net',
          'ws://127.0.0.1:*', // ✅ Allows WebSocket connections
          'wss://127.0.0.1:*', // ✅ Secure WebSocket (optional)
        ],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      },
    },
  }),
);

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

console.log('Enviornmet: ', process.env.NODE_ENV);

// RATE LIMIT MIDDLEWARE: Limit requestsfrom same IP address
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP. Please try again in an hour.',
});
app.use('/api', limiter);

// DATA SANITIZATION MIDDLEWARE----------
// 1) Data sanitization against NoSQL query injection
app.use(mongoSalitize());

// 2) Data sanitization against XSS
app.use(xss());

// 3) Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// Custom Middleware
// Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  // We can get access to http headers in express using req.headers. This provides header object.
  // console.log('----Logging REQ HEADERS OBJECT------', req.headers);
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

// FRONTEND PART ROUTES
app.use('/', viewRouter);

// BACKEND PART API ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

/** Handling UNHANDLED ROUTE
 * PROBLEM: How to implement route handler for a route that was not catched by any other rotue handler in our app?
 * SOLUTION:
 * * All the middleware functions are executed in the same order they are in the code.
 * * So the idea is that, if the request makes its way below mounting routers, that means, our router werent able catch it. ie. neither tourRouter nor userRouter were able to catch that request.
 * * If we add a middleware function after mounting the routers, then it means if the request were not catched then it comes to this middleware function.
 * * * Then we can handle the unhandled route
 * * * When handleing, we cannot simply use app.get() or app.post() to handle only those request, we need a way to handle all requests with other http request methods.
 * * * So we use app.all() this means for all http request and to specify the url use use '*' to denote all routes which are not defined.
 */

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!!!`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server!!!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  // Argument to next() function call: If we pass any argument to next() function, express automaticall assumes that its an error.
  // Creating new Error inside next() function
  next(new AppError(`Can't find ${req.originalUrl} on this server!!!`, 404));
});

/** Global Error Handling in Express:
 * In Express, whenever we create a middleware function with 4 arguments(error first), express uses it as an error handling middleware function.
 * Example: app.use((err, req, res, next) => {})
 */
app.use(globalErrorHandler);

module.exports = app;
