const express = require('express');
const recommendationController = require('../controllers/recommendationController');
const authenticationController = require('../controllers/authenticationController');

const router = express.Router({
  mergeParams: true,
});

router
  .route('/:userId')
  .get(
    authenticationController.protect,
    recommendationController.getRecommendations,
  );

module.exports = router;
