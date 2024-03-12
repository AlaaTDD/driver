const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const bcrypt = require('bcryptjs');
const factory = require('./handlersFactory');
const ApiError = require('../utils/apiError');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const createToken = require('../utils/createToken');
const User = require('../models/userModel');


exports.uploadUserImage = uploadSingleImage('image');


exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);
    req.body.image = `http://91.238.160.99/users/${filename}`;
  }

  next();
});


exports.createFilterObjActive = (req, res, next) => {
  let filterObject = {};
  filterObject = {active:true };
  req.filterObj = filterObject;
  next();
};
exports.getUsersActive = factory.getAll(User,"company");

exports.createFilterObjUnActive = (req, res, next) => {
  let filterObject = {};
  filterObject = {active:false };
  req.filterObj = filterObject;
  next();
};
exports.getUsersUnActive = factory.getAll(User);

exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  filterObject = { typeaccount: "شركه",active:true };
  req.filterObj = filterObject;
  next();
};

exports.getUsersCompanies = factory.getAllUser(User);

exports.getUser = factory.getOne(User);


exports.getUserForuser = factory.getOne(User);

exports.createUser = factory.createOne(User);


exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});


exports.deleteUser = factory.deleteOne(User);


exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});


exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  const token = createToken(user._id);
  res.status(200).json({ data: user, token });
});


exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      image: req.body.image,
    },
    { new: true }
  );

  res.status(200).json({ data: updatedUser });
});


exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: 'Success' });
});


exports.confirmLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, { active: true });

  res.status(204).json({ status: 'Success' });
});

exports.deleteUserAndWallet = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const document = await User.findByIdAndDelete(id);
  if (!document) {
    return next(new ApiError(`هذا الحساب غير موجود`, 401));
  }
  await wallet.findOneAndDelete({user:id});
  document.remove();
  res.status(204).send();
});