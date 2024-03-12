const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const ApiError=require('../errors/apierror')
const lostModel=require('../models/lostModel')
const cloudinary=require('../middleware/cloudinary');

const addLost=async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    cloudinary.uploader.upload(req.file.path,{ folder: 'lostcal' },async(err,result)=>{
        if(err) {
           console.log(err);
           return  res.status(500).json({
                success:false,
                message:"error uploading image"
           })
        }  
        try {
            const savedData = await lostModel.create({
                img: result.secure_url,
                name: req.body.name,
                address:req.body.address,
                phoneNumber:req.body.phoneNumber,
                email:req.body.email,
               user:req.user._id
            });
    
            res.status(200).json({
                success: true,
                message: "Uploaded",
                data: savedData
            });
        } catch (error) {
            console.error('Error saving data to database:', error);
            res.status(500).json({
                success: false,
                message: "Error saving data to database"
            });
        }
    });

    }


    const clearReq=async(req,res,nxt)=>{
      const {id}=req.params
      await lostModel.findOneAndDelete(id);
      res.status(200).send("request deleted sucessfully");
    }
    
    
  const updateLost = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    console.log('Request received in /update endpoint');
    console.log('Req.body:', req.body); // Log the request body
    console.log('Req.files:', req.files); // Log the files received in the request

    const {  name, address, email, phoneNumber } = req.body;
   const {id}= req.params;

    // Check if ID is provided
    if (!id) {
        return res.status(400).json({ errors: [{ msg: 'ID is required for updating' }] });
    }

    // Create an array of objects with img data and contentType for each field
    let image = {}; // Initialize image as an empty object

    // Check if files are uploaded and if there's at least one file
    if (req.files && req.files.length > 0) {
        const file = req.files[0]; // Get the first file from req.files
    
        // Assign properties of the file to image
        image = {
            data: file.buffer,
            contentType: file.mimetype
        };
    } else {
        // Handle case where no files are uploaded
        console.log('No files uploaded with the request');
    }
    

    try {
        // Find the existing missing person by ID
        const existingLost = await lostModel.findById(id);

        // Check if the missing person exists
        if (!existingLost) {
            return res.status(404).json({ errors: [{ msg: 'lost person not found' }] });
        }

        // Update the fields
        existingMissing.name = name;
        existingMissing.address = address;
        existingMissing.email = email;
        existingMissing.phoneNumber = phoneNumber;
        existingMissing.img = image;

        // Save the updated missing person
        await existingLost.save();

        res.status(200).send('Updated successfully');
    } catch (error) {
        console.error('Error updating missing person:', error);
        res.status(500).send('Internal Server Error');
    }
};

  module.exports={addLost,clearReq,updateLost}

