const factory = require("./handlersFactory");
const NotificationModel = require("../models/notificationmodel");

exports.createFilterObjNotification = (req, res, next) => {
    let filterObject = {};
    filterObject = {user:req.user._id };
    req.filterObj = filterObject;
    next();
  };
exports.getNotifications = factory.getAll(NotificationModel);

exports.createNotification = factory.createOne(NotificationModel);



