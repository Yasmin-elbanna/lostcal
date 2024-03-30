const {addLost,deleteLost,lostReq}=require('../controller/lostController')
const express = require("express");
const router = express.Router();
const {uploadSingleImage}=require('../middleware/uploadImages');

const{createlostValidator,deletelostValidator}=require("../validation/lostValidation")
const {authorized}=require('../middleware/authorization')

router.post('/',authorized ,uploadSingleImage('img'),createlostValidator,addLost)
router.delete('/:id',authorized,deletelostValidator,deleteLost)
//router.put('/:id',authorized,uploadSingleImage('img'),lostValidate,updateLost)
router.get('/',authorized,lostReq)


module.exports = router;
