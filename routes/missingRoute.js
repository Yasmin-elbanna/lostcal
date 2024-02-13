const {addMissing}=require('../controller/missingController')
const express = require("express");
const router = express.Router();
const {uploadArrayOfImages} = require("../middleware/uploadImages");



router.post('/add', uploadArrayOfImages(['img']),addMissing)



module.exports = router;
