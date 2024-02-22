const  mongoose  = require("mongoose");

const imageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
});

const schema = mongoose.Schema({
  name:{
    type:String,
  },

  img:[imageSchema],
  
  address:{
    type:String
  },
  age:{
    type:Number
  },
  email: {
    type: String,
    required: true,
    unique: true,
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

  missingPepole=mongoose.model('missingPepole',schema);
  module.exports=missingPepole;
