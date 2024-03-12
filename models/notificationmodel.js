const mongoose = require("mongoose");


const notificationSchema = new mongoose.Schema(
  {
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'notification must be belong to user'],
      },
    title: {
      type: String,
      required: [true, "title required"],
    },
    body: {
      type: String,
      required: [true, 'body time required'],
    },
  },
  { timestamps: true }
);

const notificationsModel = mongoose.model("Notification", notificationSchema);

module.exports = notificationsModel;
