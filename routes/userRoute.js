const {signup,login}=require('../controller/userController')
const express = require("express");
const router = express.Router();
const {signupValidate,loginValidate}=require('../validation/userValidate')



router.post('/signup',signupValidate,signup)
router.post('/login',loginValidate,login)



module.exports = router;
