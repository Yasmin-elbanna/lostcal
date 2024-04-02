const { validationResult } = require('express-validator');
const bcrypt=require('bcrypt')
const ApiError=require('../middleware/apierror')
const usermodel=require('../models/userModel')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler');
const catchAsync = require('../middleware/catchAsync');


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

  const myinfo=catchAsync( async (req, res, next) => {
    const user = req.user._id
    console.log(user)
    const findinfo = await usermodel.findOne({_id:user});
    
    if (findinfo) 
    return res.json({"username":findinfo.username , "email":findinfo.email});
   console.log(findinfo)
    return next(
       new ApiError("user not found",404)
    );
  });
 const changeName=catchAsync(async(req,res,next)=>{
  const { id } = req.params;
  const user =await usermodel.findById(id);
  if(!user){
    return next(
      new ApiError("user not found",404)
   );
  }
  const { username } = req.body;
  const updatproduct = await usermodel.findByIdAndUpdate(id,{username} );
  res.status(200).send("updated username sucessfully")

 })
  module.exports={signup,login,myinfo,changeName}