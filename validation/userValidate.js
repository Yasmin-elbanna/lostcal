const {check}=require("express-validator")
const User=require('../models/userModel')
const apierror=require('../middleware/apierror')
const validatorMiddleware = require('../middleware/validator');

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
    ,check('password').notEmpty().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,15}$/).withMessage("Invalid password")
,validatorMiddleware
];


const loginValidate=[check('email').notEmpty().withMessage('please entre email').isEmail().withMessage('Invalid email'),
check('password').notEmpty().withMessage('please entre password')
,validatorMiddleware];
const changeNameValidator = [
    check('id').isMongoId().withMessage('Invalid lost id format'),
    check('username').notEmpty().withMessage("please entre your username").isLength({min:4}).withMessage("Invalid username")
    ,
    validatorMiddleware,
  ];
  module.exports={signupValidate,loginValidate,changeNameValidator}
