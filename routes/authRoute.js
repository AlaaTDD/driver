const express = require('express');
const {
  signupValidator,
  loginValidator,
} = require('../utils/validators/authValidator');

const {
  signupDriver,
  signupUser,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
  resizeUserImages,
  uploadUserImages,
  PhoneorEmail,
  getOTP,
  deleteOTP,
  createFilterObj,
  getOTPUser
} = require('../services/authService');
const authService = require('../services/authService');
const router = express.Router();

router.post('/signup/driver',uploadUserImages,resizeUserImages, signupValidator, signupDriver);
router.post('/signup/user', signupValidator, signupUser);
router.post('/login',PhoneorEmail, loginValidator, login);
router.post('/forgotPassword',authService.protect,authService.allowedTo('admin'), forgotPassword);
router.get('/otp',authService.protect,authService.allowedTo('admin'), getOTP);
router.get('/otpuser',authService.protect,authService.allowedTo('admin','user'), createFilterObj,
getOTPUser);

router.delete('/otp/:id',authService.protect,authService.allowedTo('admin'), deleteOTP);

router.post('/verifyResetCode', verifyPassResetCode);
router.put('/resetPassword', resetPassword);

module.exports = router;
