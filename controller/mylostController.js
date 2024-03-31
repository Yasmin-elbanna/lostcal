const asyncHandler = require('express-async-handler');
const ApiError=require('../middleware/apierror')
const mylostModel=require('../models/mylostModel')
const cloudinary=require('../middleware/cloudinary');
const catchAsync = require('../middleware/catchAsync');

const addMylost= async(req, res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
  
    const images=[];
    const publicID=[]
   const promises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
         cloudinary.uploader.upload(file.path,{ folder: 'lostcal' },(err,result)=>{
            if(err) {
               console.log(err);
               return  res.status(500).json({
                    success:false,
                    message:"error uploading image"
               })
            }
            try {
               images.push( result.secure_url);
               
               publicID.push(result.public_id);
               resolve();
            } catch (error) {
               console.error('Error uploading images', error);
               res.status(500).json({
                    success: false,
                    message: "Error uploading images"
                });
               reject();
            }
         })
      });
   });

   await Promise.all(promises);
   const savedData = await mylostModel.create({
      img:images,
      publicId:publicID,
      name: req.body.name,
      address:req.body.address,
      phoneNumber:req.body.phoneNumber,
      email:req.body.email,
      age:req.body.age,
      user:req.user._id
   });
   res.status(200).json({
      success: true,
      message: "Uploaded",
      data: savedData
   });
};
   
const mylostReq= async (req, res, next) => {
    const user = req.user._id
    console.log(user)
    const findinfo = await mylostModel.find({user:user}).maxTime(10000);
    if(! findinfo){
    return next(
      new ApiError("user not found",404)
   );
    }
    const filteredResponse = findinfo.map(item => ({
      name: item.name,
      address: item.address,
      img: item.img,
      phoneNumber: item.phoneNumber,
      email: item.email,
      age: item.age,
      id:item.id
  }));
    if (findinfo && findinfo.length > 0) 
    return res.json(filteredResponse)

  
  };
    
    const search = catchAsync(async (req, res, next) => {
     
          // Search for documents where the 'name' field matches the value in req.body.name
          const findreq = await mylostModel.find({ name: req.query.name });
  
          // Check if any documents were found
          if (findreq && findreq.length > 0) {
              // Initialize an array to store the response data for each document
              const responseDataArray = [];
  
              // Loop through each document in the 'findreq' array
              for (const document of findreq) {
                  // Initialize an array to store image data for each image in the document
                  const imageDataArray = [];
  
                  // Loop through each image object in the document's 'img' array
         
                 // Add the image data and contentType to the imageDataArray
                imageDataArray.push({
                   document
                      });
                  
                  // Prepare the response data object for the current document
                  const responseData = {
                      name: document.name,
                      age: document.age,
                      address: document.address,
                      phoneNumber: document.phoneNumber,
                      images: document.img,
                  };
  
                  // Push the responseData object to the responseDataArray
                  responseDataArray.push(responseData);
              }
  
              // Send the response data array in the response body
              res.status(200).json({"result":responseDataArray});
          } else {
              // If no documents are found, send a 404 response
              return next(new ApiError("this name not found",404))
          }
      
  });
  

    
  const updateMissing = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
 
    const {  name, age, address, email, phoneNumber } = req.body;
   const {id}= req.params;

    // Check if ID is provided
    if (!id) {
        return res.status(400).json({ errors: [{ msg: 'ID is required for updating' }] });
    }

    // Create an array of objects with img data and contentType for each field
    const imagesArray = req.files.map(file => ({
        data: file.buffer,
        contentType: file.mimetype,
    }));

    try {
        // Find the existing missing person by ID
        const existingMissing = await missingModel.findById(id);

        // Check if the missing person exists
        if (!existingMissing) {
            return res.status(404).json({ errors: [{ msg: 'Missing person not found' }] });
        }
        // Update the fields
        existingMissing.name = name;
        existingMissing.age = age;
        existingMissing.address = address;
        existingMissing.email = email;
        existingMissing.phoneNumber = phoneNumber;
        existingMissing.img = imagesArray;

        // Save the updated missing person
        await existingMissing.save();

        res.status(200).send('Updated successfully');
    } catch (error) {
        console.error('Error updating missing person:', error);
        res.status(500).send('Internal Server Error');
    }
};


   
    const deleteMylost = catchAsync(async (req, res,next) => {
       
          const { id } = req.params;
          const publicId = await mylostModel.findOne({ _id: id });
      
          if (!publicId) {
            next( new ApiError("Missing not found.",404));
          }
      
          await mylostModel.findOneAndDelete({ _id: id });
          const removedImg=publicId.publicId
          await cloudinary.api.delete_resources(removedImg);
      
          res.status(200).send("Request deleted successfully.");
        
      });





  module.exports={addMylost,mylostReq,deleteMylost,search,updateMissing}

