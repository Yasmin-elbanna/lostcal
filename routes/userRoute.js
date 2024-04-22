const {signup,login,myinfo,changeName,forgotPassword,resetPassword,updatePassword}=require('../controller/userController')
const express = require("express");
const router = express.Router();
const {signupValidate,loginValidate,changeNameValidator,resetPassValidator}=require('../validation/userValidate')
const {authorized}=require('../middleware/authorization')



router.post('/signup',signupValidate,signup)
router.post('/login',loginValidate,login)
router.get('/profile',authorized,myinfo)
router.patch('/changename',authorized,changeNameValidator,changeName)
router.patch('/forgetPassword',forgotPassword)
router.patch('/resetPassword/:token',resetPassValidator,resetPassword)
router.patch('/updateMyPassword',authorized,updatePassword)


module.exports = router;
