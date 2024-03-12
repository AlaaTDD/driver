const express = require('express');
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} = require('../utils/validators/userValidator');

const {
  getUsersActive,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  confirmLoggedUserData,
  getUsersCompanies,
  createFilterObj,
  createFilterObjActive,
  createFilterObjUnActive,
  getUsersUnActive,
  deleteLoggedUserData,
  getUserForuser,
  deleteUserAndWallet,
} = require('../services/userService');

const authService = require('../services/authService');

const router = express.Router();


router.get('/companies', createFilterObj, getUsersCompanies);


router.use(authService.protect);
router.get('/getMe', getLoggedUserData, getUser);
router.put('/changeMyPassword', updateLoggedUserPassword);
router.put('/updateMe', uploadUserImage,resizeImage, updateLoggedUserData);
router.delete('/deleteMe', deleteLoggedUserData);
router.get('/user/:id',getUserForuser);
// Admin
router.use(authService.allowedTo('admin'));
router.put('/confirm/:id', confirmLoggedUserData);
router.delete('/delete/:id', deleteUserAndWallet);

router.put(
  '/changePassword/:id',
  changeUserPasswordValidator,
  changeUserPassword
);
router
  .route('/unactive')
  .get(createFilterObjUnActive, getUsersUnActive);
router
  .route('/')
  .get(createFilterObjActive, getUsersActive)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);
router
  .route('/:id')
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
