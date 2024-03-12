const express = require('express');


const {
createTrips,
deleteTrips,
getTrip,
getTrips,
updateTrips
} = require('../services/tripService');

const authService = require('../services/authService');

const router = express.Router();

router
  .route('/')
  .get(getTrips)
  .post(
    authService.protect,
    authService.allowedTo('user', 'driver'),
    createTrips
  );
router
  .route('/:id')
  .get(getTrip)
  .put(
    authService.protect,
    authService.allowedTo('user', 'driver'),
    updateTrips
  )
  .delete(
    authService.protect,
    authService.allowedTo('user', 'driver'),
    deleteTrips
  );

module.exports = router;
