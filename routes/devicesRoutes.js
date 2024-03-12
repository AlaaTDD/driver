const express = require('express');


const {
getDevices,
createFilterObjDevices
} = require('../services/devicesServices');

const authService = require('../services/authService');

const router = express.Router();


router
  .route('/')
  .get(authService.protect,
    authService.allowedTo('admin', 'user'),createFilterObjDevices,getDevices);

module.exports = router;