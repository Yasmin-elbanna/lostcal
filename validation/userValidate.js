const {check}=require("express-validator")
const User=require('../models/userModel')

const signupValidate=[check('username').notEmpty().withMessage("please entre your username").isLength({min:4}).withMessage("Invalid username")
    ,
    check('email').notEmpty().withMessage("please entre your email").isEmail().withMessage("Invalid email").custom((val)=>User.findOne({User:val}).then((user)=>{
        if(user){
           return Promise.reject(new Error('Email is already exist'))
        }
    }))
    ,check('password').notEmpty().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,15}$/).withMessage("Invalid password")];


const loginValidate=[check('email').notEmpty().withMessage('please entre email').isEmail().withMessage('Invalid email'),
check('password').notEmpty().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,15}$/).withMessage("Invalid password")];
module.exports={signupValidate,loginValidate}
    