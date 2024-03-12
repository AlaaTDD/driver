const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'user must be belong to user'],
      },
    flocation: String,
    llocation: String,
    finish_trip: {
        type: Boolean,
        default: false,
    },
    accept: {
        type: Boolean,
        default: false,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model('Trips', TripSchema);