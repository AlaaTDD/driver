const express = require('express');


const {
createServices,
deleteServices,
getService,
getServices,
updateServices,
uploadServicesImage,
resizeImage,
} = require('../services/servicesServices');

const authService = require('../services/authService');

const router = express.Router();

router
  .route('/')
  .get(getServices)
  .post(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadServicesImage,
    resizeImage,
    createServices
  );
router
  .route('/:id')
  .get(getService)
  .put(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadServicesImage,
    resizeImage,
    updateServices
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteServices
  );

module.exports = router;
