//Start of Requiring MODULES
// 3d Party Modules
const express = require('express');
const multer = require('multer');

// Local Modules
const authenticationContoller = require('../controllers/authenticationController');
const userController = require('../controllers/userController');

// MULTER SETTINGS
const upload = multer({ dest: 'public/img/users' });

// End of Requiring MODULES
/** STEP TO CREATE ROUTER
 * 1) Create a router using express.Router();
 * 2) Use router to route and call the handler functions based on route
 * 3) Chain the Routes using app.route('endpoint').method(requestHandlerFunction)
 * 4) Export the router and use in the main route
 */
const router = express.Router();

router.post('/signup', authenticationContoller.signup);
router.post('/login', authenticationContoller.login);
router.get('/logout', authenticationContoller.logout);

router.post('/forgotPassword', authenticationContoller.forgetPassword);
router.patch('/resetPassword/:token', authenticationContoller.resetPassword);

// We should protect all routes after this

// .protect() is technically a middleware, it runs in a sequence. so when we can use .protect() middlewre in router to check for authenticated user
router.use(authenticationContoller.protect);

router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMyPassword', authenticationContoller.updatePassword);
router.patch('/updateMe', upload.single('photo'), userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

// Users Route:
// Below routes should be only be accessed by amdins so we can use middleware again
router.use(authenticationContoller.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
