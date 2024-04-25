const jwt = require('jsonwebtoken')
const utli = require('util')
const asyncverify = utli.promisify(jwt.verify)
const ApiError = require('./apierror')
const User=require('../models/userModel')
const catchAsync=require('../middleware/catchAsync')

const authorized=catchAsync( async (req, res, next) => {
  let token;
  if (  req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer') )
     {
      token = req.headers.authorization.split(' ')[1];
    }else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  console.log( req.cookies.jwt );
   if (!token) {
    return next(
      new ApiError(
        'You are not login, Please login to get access',
        401
      )
    );
  }
  // 2) Verify token not expire token
  
  const decoded = jwt.verify(token, process.env.secretkey);
  console.log(decoded);
 
// 3) Check if user exists
  const currentUser = await User.findById(decoded.id);
  console.log(currentUser)
  if (!currentUser) {
    return next(
      new ApiError(
        'The user that belong to this token does no longer exist',
        401
      )
    );
  }

  // 4) Check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    //console.log(passChangedTimestamp)
  
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          'User recently changed his password. please login again..',
          401
        )
      );
    }
  }

  req.user = currentUser;
  next();
});


module.exports = {authorized}