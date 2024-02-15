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
        user:  req.user._id,
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
    const myreq= async (req, res, next) => {
      const findreq = await missingModel.find({user:req.user._id});
      if (findreq) return res.send(findreq);
     console.log(findreq)
      return next(
         new ApiError("requst not found",404)
      );
    };
    const clearReq=async(req,res,nxt)=>{
      const {id}=req.params
      await missingModel.findOneAndDelete(id);
      res.status(200).send("request deleted sucessfully");
    }
    
    const search = async (req, res, next) => {
      try {
          // Search for documents where the 'name' field matches the value in req.body.name
          const findreq = await missingModel.find({ name: req.body.name });
  
          // Check if any documents were found
          if (findreq && findreq.length > 0) {
              // Initialize an array to store the response data for each document
              const responseDataArray = [];
  
              // Loop through each document in the 'findreq' array
              for (const document of findreq) {
                  // Initialize an array to store image data for each image in the document
                  const imageDataArray = [];
  
                  // Loop through each image object in the document's 'img' array
                  for (const imageObject of document.img) {
                      // Add the image data and contentType to the imageDataArray
                      imageDataArray.push({
                          data: imageObject.data.toString('base64'), // Convert binary data to base64 string
                          contentType: imageObject.contentType
                      });
                  }
  
                  // Prepare the response data object for the current document
                  const responseData = {
                      name: document.name,
                      age: document.age,
                      address: document.address,
                      email: document.email,
                      phoneNumber: document.phoneNumber,
                      images: imageDataArray
                  };
  
                  // Push the responseData object to the responseDataArray
                  responseDataArray.push(responseData);
              }
  
              // Send the response data array in the response body
              res.json(responseDataArray);
          } else {
              // If no documents are found, send a 404 response
              res.status(404).json({ error: 'Documents not found' });
          }
      } catch (error) {
          // Handle any errors that occur during the retrieval process
          console.error('Error retrieving documents:', error);
          res.status(500).json({ error: 'Internal server error' });
      }
  };
  
    
  const updateMissing = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    console.log('Request received in /update endpoint');
    console.log('Req.body:', req.body); // Log the request body
    console.log('Req.files:', req.files); // Log the files received in the request

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

  module.exports={addMissing,myreq,clearReq,search,updateMissing}

