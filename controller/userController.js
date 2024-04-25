const { validationResult } = require('express-validator');
const bcrypt=require('bcrypt')
const ApiError=require('../middleware/apierror')
const usermodel=require('../models/userModel')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler');
const catchAsync = require('../middleware/catchAsync');
const Email = require('../middleware/email');
const crypto= require('crypto');

const env=require("dotenv")
env.config({path:'config.env'})

const signToken = id => {
  return jwt.sign({ id },
     process.env.SECRETKEY, {
    expiresIn: process.env.EXPIRETIME
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expire: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;
  user.passwordConfirm = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};
const signup =catchAsync( async (req, res,next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const {username, email, password ,passwordConfirm } = req.body;
        
        const newuser = await usermodel.create({
           username,
            email,
          password,
          passwordConfirm
        });
      
  const url = `${req.protocol}://${req.get('host')}api/user/profile`;
  // console.log(url);
  await new Email(newuser, url).sendWelcome();

           createSendToken(newuser, 200, res);
      
  });

const login=catchAsync(async(req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const { email, password } = req.body;
    const finduser = await usermodel.findOne({email}).select('+password');
    
    if (!finduser || !(await finduser.correctPassword(password, finduser.password))) {
      return next(new ApiError('Incorrect email or password', 401));
    }
  
    createSendToken(finduser, 200, res);

  

  });

  const myinfo=catchAsync( async (req, res, next) => {
    const user = req.user._id
    console.log(user)
    const findinfo = await usermodel.findOne({_id:user});
    
    if (findinfo) 
    return res.json({"username":findinfo.username , "email":findinfo.email,"_id":findinfo.id});
   console.log(findinfo)
    return next(
       new ApiError("user not found",404)
    );
  });
 const changeName=catchAsync(async(req,res,next)=>{
  const id=req.user._id;
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
 const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await usermodel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
 

  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/user/resetPassword/${resetToken}`;
  console.log(resetURL);
    await new Email(user, resetURL).sendPasswordReset();


    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
console.log(err)
    return next(
      new ApiError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
console.log(hashedToken);
  const user = await usermodel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new ApiError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  const token =await user.generateToken();
  createSendToken(user, 200, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await usermodel.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new ApiError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});
const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};
  module.exports={signup,login,myinfo,changeName,forgotPassword,resetPassword,updatePassword,logout}