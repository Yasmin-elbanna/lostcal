const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const ApiError=require('../errors/apierror')
const missingModel=require('../models/missingModel')


const addMissing= (req, res) => {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    console.log('Request received in /add endpoint');
    console.log('Req.body:', req.body); // Log the request body
    console.log('Req.files:', req.files); // Log the files received in the request
  
    const { name,age,address,email,phoneNumber} = req.body;
    
      // Create an array of objects with img data and contentType for each field
      const imagesArray = req.files.map(file => ({
        data: file.buffer,
        contentType: file.mimetype,
      }));
   
      // Create a new instance of the MissingModel model
      const newMissing = new missingModel({
       name:name,
       age:age, 
       address:address, 
       email:email,
       phoneNumber:phoneNumber,
      img: imagesArray,
      });
     newMissing.save() ;
    res.status(200).send("saved successfully")
    }
  module.exports={addMissing}

