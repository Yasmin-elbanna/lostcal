const {check}=require("express-validator")
const User=require('../models/userModel')
const apierror=require('../middleware/apierror')
const signupValidate=[check('username').notEmpty().withMessage("please entre your username").isLength({min:4}).withMessage("Invalid username")
    ,
    check('email').notEmpty().withMessage("please entre your email").isEmail().withMessage("Invalid email").custom(async (value, req) => {
        try {
         const user = await User.findOne({email: value})
         if (user) {
          return Promise.reject('User is already exist')
         }
        } catch (e) {
         console.log(e);
        }
       })
    ,check('password').notEmpty().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,15}$/).withMessage("Invalid password")];


const loginValidate=[check('email').notEmpty().withMessage('please entre email').isEmail().withMessage('Invalid email'),
check('password').notEmpty()];
module.exports={signupValidate,loginValidate}
    