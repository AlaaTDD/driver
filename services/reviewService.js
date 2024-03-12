const factory = require('./handlersFactory');
const Review = require('../models/reviewModel');


exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.driverId) filterObject = { product: req.params.driverId };
  req.filterObj = filterObject;
  next();
};


exports.getReviews = factory.getAll(Review);


exports.getReview = factory.getOne(Review);

exports.setdriverIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.driver) req.body.driver = req.params.driverId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
