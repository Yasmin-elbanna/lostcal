const  mongoose  = require("mongoose");
const schema = mongoose.Schema({
  name:{
    type:String,
  },
  img: {
    type: String,
    required: true
} ,
publicId:{
  type:String
},
  address:{
    type:String
  },

  email: {
    type: String,
    required: true,
     match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
},
phoneNumber:{
  type:Number,
  match:[/^01[0125][0-9]{8}$/,'phone number not correct']

},
user: {
  type: mongoose.Schema.ObjectId,
  ref: 'users',
},
     

},{ timestamps: true });

  lostPepole=mongoose.model('lostPepole',schema);
  module.exports=lostPepole;
