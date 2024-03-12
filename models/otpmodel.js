const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'notification must be belong to user'],
    },
    otp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
OTPSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'fname email phone -_id',
  });
  next();
});
const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;
