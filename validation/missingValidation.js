const {check}=require("express-validator")
const missing=require('../models/missingModel')
const addValidate=[
    check('name').notEmpty().withMessage("please entre your name").isLength({min:4}).withMessage("Invalid username")
    ,
    check('email').notEmpty().withMessage("please entre your email").isEmail().withMessage("Invalid email").custom(async (value, req) => {
        try {
         const user = await missing.findOne({email: value})
         if (user) {
          return Promise.reject('this email is already in use')
         }
        } catch (e) {
         console.log(e);
        }
       })
    ,check('phoneNumber').notEmpty().withMessage("please entre your phone number").isNumeric().withMessage("Not valid phone number").matches(/^01[0125][0-9]{8}$/).withMessage("Not valid phone number")
    ,check('address').notEmpty().withMessage("please entre your address").isAlpha().withMessage("Invalid address"),
];



module.exports={addValidate}
    