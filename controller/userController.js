const { validationResult } = require('express-validator');
const bcrypt=require('bcrypt')
const ApiError=require('../errors/apierror')
const usermodel=require('../models/userModel')
const jwt = require('jsonwebtoken')


const signup = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const {username, email, password } = req.body;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
        
        const newuser = new usermodel({
           username,
            email,
          password,
         
        });
        const token = jwt.sign({
          id: newuser._id,
          isAdmin:newuser._isAdmin,       
        }, process.env.secretkey, {
          expiresIn: process.env.expiretime,
        })

        newuser.save().then((result) => {
         return res.json({result,token});
        });
      
  };

const login=async(req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const { email, password } = req.body;
    const finduser = await usermodel.findOne({email});
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    if (!finduser) {
       return next(
      new ApiError("password or email is not correct",400)
      );
    }
   else{
    const copmarpass = await bcrypt.compare(password, finduser.password);
    if (copmarpass) {
      const token = await finduser.generateToken();
       return res.status(200).send({token:token});
    }
   
    return next(
      new ApiError("password or email is not correct",400)
      );
   }
  }

  const myinfo= async (req, res, next) => {
    const findinfo = await usermodel.findOne({user:req.user._id});
    if (findinfo) res.send(findinfo);
   console.log(findinfo)
    return next(
       new ApiError("user not found",404)
    );
  };
  module.exports={signup,login,myinfo}