const {signup,login,myinfo,changeName}=require('../controller/userController')
const express = require("express");
const router = express.Router();
const {signupValidate,loginValidate,changeNameValidator}=require('../validation/userValidate')
const {authorized}=require('../middleware/authorization')



router.post('/signup',signupValidate,signup)
router.post('/login',loginValidate,login)
router.get('/profile',authorized,myinfo)
router.patch('/changename/:id',authorized,changeNameValidator,changeName)


module.exports = router;
