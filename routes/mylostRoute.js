const express = require("express");
const router = express.Router();
const {addMylost,deleteMylost,search,updateMissing,mylostReq}=require('../controller/mylostController')
const {uploadArrayOfImages,validateImageCount} = require("../middleware/uploadImages");
const{missingValidate,deleteMylostValidator}=require("../validation/mylostValidation")
const {authorized}=require('../middleware/authorization')

router.post('/',authorized ,uploadArrayOfImages(['img']),validateImageCount,missingValidate,addMylost)
router.delete('/:id',authorized,deleteMylostValidator,deleteMylost)
router.get('/search',authorized,search)
//router.put('/updateData/:id',authorized,uploadArrayOfImages(['img']),validateImageCount,missingValidate,updateMissing)
router.get('/',authorized,mylostReq)


module.exports = router;
