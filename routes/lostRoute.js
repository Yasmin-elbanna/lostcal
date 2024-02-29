const {addLost,clearReq,updateLost}=require('../controller/lostController')
const express = require("express");
const router = express.Router();
const {uploadSingleImage}=require('../middleware/uploadImages');

const{lostValidate}=require("../validation/lostValidation")
const {authorized}=require('../middleware/authorization')

router.post('/',authorized ,uploadSingleImage('img'),lostValidate,addLost)
router.delete('/myreq/:id',authorized,clearReq)
//router.put('/:id',authorized,uploadSingleImage('img'),lostValidate,updateLost)


module.exports = router;
