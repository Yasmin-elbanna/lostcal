const asyncHandler = require('express-async-handler');
const ApiError=require('../middleware/apierror')
const mylostModel=require('../models/mylostModel')
const cloudinary=require('../middleware/cloudinary');
const catchAsync = require('../middleware/catchAsync');

const addMylost= async(req, res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
  
    const images=[];
    const publicID=[]
    for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, { folder: 'lostcal' });
        images.push(result.secure_url);
        publicID.push(result.public_id);
    }

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
   
const mylostReq=catchAsync( async (req, res, next) => {
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

  
  });
    
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
  

    
  const updateMylostData = catchAsync(async (req, res,next) => {

    const {  name, age, address, email, phoneNumber } = req.body;
   const {id}= req.params;

        // Find the existing missing person by ID
        const mylostData = await mylostModel.findById(id);
        // Check if the missing person exists

        if(!mylostData){
            next( new ApiError("Missing not found.",404));

        }
        const removedImg=mylostData.publicId
        await cloudinary.api.delete_resources(removedImg);
        const images=[];
        const publicID=[]
        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path, { folder: 'lostcal' });
            images.push(result.secure_url);
            publicID.push(result.public_id);
        }
   // console.log(images)
      
        const newData=await mylostModel.findByIdAndUpdate(id,{
            name:name,
            email:email,
            address:address,
            phoneNumber:phoneNumber,
            age:age,
            img:images,
            publicId:publicID} 
            );

        res.status(200).json({"newData":newData});
    } );


   
    const deleteMylost = catchAsync(async (req, res,next) => {
       
          const { id } = req.params;
          const publicId = await mylostModel.findOne({ _id: id });
      
          if (!publicId) {
            next( new ApiError("Missing not found.",404));
          }
          const removedImg=publicId.publicId
          //console.log(removedImg);
          await cloudinary.api.delete_resources(removedImg);
      
          await mylostModel.findOneAndDelete({ _id: id });
          
          res.status(200).send("Request deleted successfully.");
        
      });





  module.exports={addMylost,mylostReq,deleteMylost,search,updateMylostData}

