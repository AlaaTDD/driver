const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const handel = require('./handlersFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const Services = require('../models/servicesModel');

exports.uploadServicesImage = uploadSingleImage('image');

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `Services-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/services/${filename}`);
    req.body.image = filename;
  }
  next();
});

exports.getServices = handel.getAll(Services);

exports.getService = handel.getOne(Services);

exports.createServices = handel.createOne(Services);

exports.updateServices = handel.updateOne(Services);

exports.deleteServices = handel.deleteOne(Services);
