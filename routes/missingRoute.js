const express = require("express");
const router = express.Router();
const {addMissing,deleteMylost,search,updateMissing}=require('../controller/missingController')
const {uploadArrayOfImages,validateImageCount} = require("../middleware/uploadImages");
const{missingValidate}=require("../validation/missingValidation")
const {authorized}=require('../middleware/authorization')

router.post('/add',authorized ,uploadArrayOfImages(['img']),validateImageCount,missingValidate,addMissing)
router.delete('/mylost/:id',authorized,deleteMylost)
router.get('/search',authorized,search)
//router.put('/updateData/:id',authorized,uploadArrayOfImages(['img']),validateImageCount,missingValidate,updateMissing)


module.exports = router;
