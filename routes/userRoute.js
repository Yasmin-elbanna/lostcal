const {signup,login,myinfo,lostReq,mylostReq}=require('../controller/userController')
const express = require("express");
const router = express.Router();
const {signupValidate,loginValidate}=require('../validation/userValidate')
const {authorized}=require('../middleware/authorization')



router.post('/signup',signupValidate,signup)
router.post('/login',loginValidate,login)
router.get('/profile',authorized,myinfo)
router.get('/lost',authorized,lostReq)
router.get('/mylost',authorized,mylostReq)



module.exports = router;
