const express = require("express");


const {
  getNotifications,
  createNotification,
  createFilterObjNotification
} = require("../services/notificaionservices");

const AuthServices = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(createFilterObjNotification,getNotifications)
  .post(
    AuthServices.protect,
    AuthServices.allowedTo("admin","user"),
    createNotification
  );



module.exports = router;
