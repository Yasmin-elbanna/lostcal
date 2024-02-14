const {addMissing,myreq,clearReq,search}=require('../controller/missingController')
const express = require("express");
const router = express.Router();
const {uploadArrayOfImages,validateImageCount} = require("../middleware/uploadImages");
const{addValidate}=require("../validation/missingValidation")
const {authorized}=require('../middleware/authorization')

router.post('/add',authorized ,uploadArrayOfImages(['img']),validateImageCount,addValidate,addMissing)
router.get('/myreq',authorized ,myreq)
router.delete('/myreq/:id',authorized,clearReq)
router.get('/search',authorized,search)

module.exports = router;
