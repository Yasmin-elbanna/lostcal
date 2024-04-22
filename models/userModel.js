const  mongoose  = require("mongoose");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const utli = require('util');
const asyncsign = utli.promisify(jwt.sign)
const crypto = require('crypto');

const schema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength:4
    },
    email: {
        type: String,
        required: true,
        unique:true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minLength:6,
        match:[/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,15}$/,'Please fill a valid password'],  //special/number/capital
        select:false, 
    },
    passwordConfirm: {
        type: String,
        required: true,
    },    
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    isAdmin:{
        type:Boolean,
        default:false,
    },
  

},{ timestamps: true });
schema.pre("save",async function(next){
    if (this.isModified('password')) {
        const saltpass=15;
        const hashpass= await bcrypt.hash(this.password, saltpass)
        this.password = hashpass
    }
    this.passwordConfirm = undefined;

    next();
})
schema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
  
    this.passwordChangedAt = Date.now() - 1000;
    next();
  });
  schema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };
  
schema.methods.generateToken = function () {
    const token = asyncsign({
      id: this.id,
      email: this.email,
      isAdmin: this.isAdmin
   
    }, process.env.secretkey)
    return token
  }
  schema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    // console.log({ resetToken }, this.passwordResetToken);
  
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
  };
  
  userShema=mongoose.model('users',schema);
  module.exports=userShema;
