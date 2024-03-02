const {check}=require("express-validator")
const missing=require('../models/missingModel')
const missingValidate=[
    check('name').notEmpty().withMessage("please entre your name")
    ,
    check('email').notEmpty().withMessage("please entre your email").isEmail().withMessage("Invalid email")
        
    ,check('phoneNumber').notEmpty().withMessage("please entre your phone number").isNumeric().withMessage("Not valid phone number").matches(/^01[0125][0-9]{8}$/).withMessage("Not valid phone number")
    ,check('address').notEmpty().withMessage("please entre your address"),
];



module.exports={missingValidate}
    