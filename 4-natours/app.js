// =======================Tutorial===================================

// Core Module
const fs = require('fs');
// Requiring the express package
const express = require('express');

const morgan = require('morgan');

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

// Read the data of all tours at once (in top level code)

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// ROUTE HANDLERS
// Refactoring ROUTES (By seprating Request Handler Function)
const getAllTours = (req, res) => {
  console.log(req.requestTime);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    // Sending no of results we have since its an array we can count the length of that array.
    results: `${tours.length} results found`,
    // Envolope for our data
    data: {
      // url's endpoint: send the data that we need to send as response
      tours: tours,
    },
  });
};

const createTour = (req, res) => {
  // post request is used to send data from the client to the server. So the data sent is availiable in the request objet of the requestHandler function.
  // Express does not put the body data of request out of the box. So to have the request data availiable, we need to use middleware ie. app.use(express.json()) middleware in the top level code.

  // console.log(req.body);

  //Figure out the id of the new object to be created(REST API: we never specify the ID of the object)
  // Total tours -> 9
  // tours.length -> 9
  // tours.length -1 -> 8
  // If there are n array items, then last array item is always (n-1)

  const newId = tours[tours.length - 1].id + 1;

  // tours[9-1] -> tours[8] -> last element -> .id => 8 -> +1 => 9 = newId

  // Combine the newId and the request body data to form one object
  const newTour = Object.assign({ id: newId }, req.body);
  //     const newTour = {id: newId, ...req.body}

  // Push the new tour to the array
  tours.push(newTour);

  // Finally, save/persist the newly pushed data
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  console.log('-----------------------------');
  // Consoling the data in the URL Parameter
  console.log('Request->params data');
  console.log(req.params);
  // Consoling request-> body's data(sent by the client)
  console.log('Request->body data');
  console.log(req.body);
  console.log('-----------------------------');

  // 1) REVEIVE THE INCOMING DATA:  Get the updated data from the client that is in req.body
  const updatedTourData = req.body;
  console.log('Updated Tour Data from req.body:');
  console.log(updatedTourData);

  // 2) FIND THE EXISTING TOUR:
  // 2.1) Getting the tour ID from the request params using unique parameter id
  const tourId = parseInt(req.params.id);
  console.log(`ID to be updated: ${tourId}`);

  // 2.2) Find the matching tour to update
  const tour = tours.find((tour) => tour.id === tourId);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID, no tour found to update',
    });
  }

  console.log('Tour data before UPDATE:::');
  console.log(tour);

  // Update the fields that are present in the req.body
  for (let key in updatedTourData) {
    if (tour.hasOwnProperty(key)) {
      tour[key] = updatedTourData[key]; // Updating only the filed requested to update.
    }
  }

  console.log('Tour data AFTER UPDATE:::');
  console.log(tour);
  // Push the new tour to the array
  // tours.push(tour);

  // save the updated data.
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: 'success',
        data: {
          tour: tour,
        },
      });
    }
  );
};

const deleteTour = (req, res) => {
  // Identify item to be deleted
  // Get the id of the item
  const id = parseInt(req.params.id);
  // find the item in the API(file based api)
  // const tour = tours.find((tour) => tour.id === id);

  // // Check if tour requested to be deleted exsixts
  // if (!tour) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID. No tour found with the requested id.',
  //   });
  // }

  //Remove the item using .filter() . The filter() method creates a new array filled with elements that pass a test provided by a function. The filter() method does not execute the function for empty elements. The filter() method does not change the original array

  // Use array.filter() method to delete data if the array size is smaller else use findIndex() and then .splice() to delte the data for large array or datasets.
  // const updatedTours = tours.filter((tour) => !tour.id === id);
  // console.log(updatedTours);

  // find indes of the tour to be deleted
  const indexOfTourToDelete = tours.findIndex((tour) => tour.id === id);
  tours.splice(indexOfTourToDelete, 1);

  console.log(tours);

  // Save the file after deletion of data
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
  );
};

const getTour = (req, res) => {
  // request.params is where all the variables in URL parameter are store.
  console.log(req.params);

  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  // Finding if the requested ID exists.
  // if (id > tours.length) { // If the ID doesnot exsist, then there is no tour.
  if (!tour) {
    // If there is no tour(undefined) its invalid
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  console.log(tour);

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

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
const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

// Users Route:
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

// Connecting new Router with our Application(we use middleware)
// Mounting Routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// We first should start a server
const port = 3000;

app.listen(port, () => {
  console.log(`Our App is running in the port ${port}.`);
});
