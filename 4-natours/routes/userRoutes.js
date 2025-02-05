//Start of Requiring MODULES
// 3d Party Modules
const express = require('express');

// Local Modules
const authenticationContoller = require('../controllers/authenticationController');
const userController = require('../controllers/userController');

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

router.post('/forgotPassword', authenticationContoller.forgetPassword);
router.patch('/resetPassword/:token', authenticationContoller.resetPassword);

router.patch(
  '/updateMyPassword',
  authenticationContoller.protect,
  authenticationContoller.updatePassword,
);

router.patch(
  '/updateMe',
  authenticationContoller.protect,
  userController.updateMe,
);

// Users Route:
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
