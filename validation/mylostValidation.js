const {check}=require("express-validator")
const validatorMiddleware = require('../middleware/validator');

const missingValidate=[
    check('name').notEmpty().withMessage("Please entre your name")
    ,
    check('email').notEmpty().withMessage("Please entre your email").isEmail().withMessage("Invalid email")
        
    ,check('phoneNumber').notEmpty().withMessage("Please entre your phone number").matches(/^01[0125][0-9]{8}$/).withMessage("Invalid phone number")
    ,check('address').notEmpty().withMessage("Please entre your address"),validatorMiddleware
];
const deleteMylostValidator = [
    check('id').isMongoId().withMessage('Invalid lost id format'),
    validatorMiddleware,
  ];


module.exports={missingValidate,deleteMylostValidator}
    