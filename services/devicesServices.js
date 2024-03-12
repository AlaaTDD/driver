const handel = require('./handlersFactory');
const Devices = require('../models/devicesmodel');

exports.createFilterObjDevices = (req, res, next) => {
    let filterObject = {};
    filterObject = {user:req.user._id };
    req.filterObj = filterObject;
    next();
  };

exports.getDevices = handel.getAll(Devices);
exports.updateDevices = handel.updateOne(Devices);
