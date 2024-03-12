const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const { uploadMixOfImages } = require('../middlewares/uploadImageMiddleware');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const sendEmail = require('../utils/sendEmail');
const createToken = require('../utils/createToken');
const User = require('../models/userModel');
const devicesmodel = require('../models/devicesmodel');
const otpmodel=require('../models/otpmodel');
const factory = require('./handlersFactory');

exports.uploadUserImages = uploadMixOfImages([{name: 'idimage', maxCount: 2, },]);
exports.resizeUserImages = asyncHandler(async (req, res, next) => {
  if (req.files.idimage) {
    req.body.idimage = [];
    await Promise.all(
      req.files.idimage.map(async (img, index) => {
        const imageName = `User-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .toFormat('jpeg')
          .jpeg({ quality: 95 })
          .toFile(`uploads/users_id/${imageName}`);
        req.body.idimage.push(imageName);
        console.log(req.body.idimage);
      })
    );
    next();
  }
});
exports.signupDriver = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    idnumber: req.body.idnumber,
    typeaccount: 'driver',
    typecar:req.body.typecar,
    location: req.body.location,
    idimage: req.body.idimage,
    password: req.body.password,
    image:req.body.typeaccount=="شخصي"?"http://91.238.160.99/asset/logouser.png":"http://91.238.160.99/asset/logomarket.png",
  });

  const token = createToken(user._id);
  res.status(201).json({ data: user, token });
});
exports.signupUser = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    idnumber: req.body.idnumber,
    typeaccount: 'driver',
    location: req.body.location,
    idimage: req.body.idimage,
    password: req.body.password,
    image:req.body.typeaccount=="شخصي"?"http://91.238.160.99/asset/logouser.png":"http://91.238.160.99/asset/logomarket.png",
  });

  const token = createToken(user._id);
  res.status(201).json({ data: user, token });
});
// @desc    Login
// @route   GET /api/v1/auth/login
// @access  Public
exports.PhoneorEmail=asyncHandler(async (req, res, next) => {
  var user;
  if(req.body.email){
     user = await User.findOne({ email: req.body.email });
     if (!user) {
      return next(new ApiError('البريد الالكتروني او كلمة السر غير صحيحه', 401));
    }
     req.body.phone=user.phone;
    
  }else if(req.body.phone){
     user = await User.findOne({ phone: req.body.phone });
     if (!user) {
      return next(new ApiError('البريد الالكتروني او كلمة السر غير صحيحه', 401));
    }
     req.body.email=user.email;
  }
  next();
});
exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError('البريد الالكتروني او كلمة السر غير صحيحه', 401));
  }
  if (!user.active) {
    return next(new ApiError('يتم مراجعة حسابك', 401));
  }
  console.log(req.body.model);
  const Device=   await devicesmodel.findOne({model:req.body.model,user:user._id,});
  if (!Device) {
    await devicesmodel.create({
      user:user._id,
      name:req.body.name,
      model:req.body.model,
      brand:req.body.brand,
    });  }

  // 3) generate token
  const token = createToken(user._id);

  // Delete password from response
  delete user._doc.password;
  // 4) send response to client side
  res.status(200).json({ data: user, token });
});

// @desc   make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist, if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new ApiError(
        'You are not login, Please login to get access this route',
        401
      )
    );
  }

  // 2) Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3) Check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        'The user that belong to this token does no longer exist',
        401
      )
    );
  }

  // 4) Check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // Password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          'User recently changed his password. please login again..',
          401
        )
      );
    }
  }

  req.user = currentUser;
  next();
});

// @desc    Authorization (User Permissions)
// ["admin", "manager"]
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError('You are not allowed to access this route', 403)
      );
    }
    next();
  });
// @desc    get OTP
// @route   POST /api/v1/auth/otp
// @access  admin

exports.getOTP=factory.getAll(otpmodel);
// @desc    get OTP
// @route   POST /api/v1/auth/otp
// @access  admin
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  filterObject = { user: req.user._id};
  next();
};

exports.getOTPUser=factory.getAll(otpmodel);
// @desc    delete OTP
// @route   POST /api/v1/auth/otp
// @access  admin

exports.deleteOTP=factory.deleteOne(otpmodel);
// @desc    Forgot password
// @route   POST /api/v1/auth/forgotPassword
// @access  admin
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`هذا الايميل غير موجود`, 401)
    );
  }
  // 2) If user exist, Generate hash reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashednResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  // Save hashed password reset code into db
  user.passwordResetCode = hashednResetCode;
  // Add expiration time for password reset code (10 min)
  user.passwordResetExpires = Date.now() + 24* 60 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  // 3) Send the reset code via email
  const message = `Hi ${user.fname},\n We received a request to reset the password on your PayApp Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n PayApp Team`;
  
  try {
    const otp=await otpmodel.findOne({user:user._id});
    if (otp) {
      return next(
        new ApiError(`يوجد طلب بالفعل`, 401)
      );
    }
    await otpmodel.create({
      otp:resetCode,
      user:user._id
      });
   
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new ApiError('There is an error in sending email', 401));
  }

  res
    .status(200)
    .json({ status: 'Success', message: 'Reset code sent to email' ,id:user._id});
});

// @desc    Verify password reset code
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(req.body.resetCode)
    .digest('hex');

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    email:req.body.email,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    new ApiError(`الكود غير صالح`, 401)
  }
  // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: 'Success',
  });
});

// @desc    Reset password
// @route   POST /api/v1/auth/resetPassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`هذا الايميل غير موجود`, 401)
    );
  }

  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(
      new ApiError(`الكود غير صالح`, 401)
    );
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save();
  await otpmodel.deleteOne({user:user._id});
  // 3) if everything is ok, generate token
  const token = createToken(user._id);
  res.status(200).json({ token });
});
