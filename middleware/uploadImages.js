const multer = require('multer');
const ApiError = require('../errors/apierror');

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new ApiError('Only Images allowed', 400), false);
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};

exports.uploadSingleImage = (fieldName) => {
  return (req, res, next) => {
    console.log(`Middleware: Uploading single image for field ${fieldName}`);
    multerOptions().single(fieldName)(req, res, function (err) {
      if (err) {
        console.error('Error uploading single image:', err);
        return res.status(400).json({ error: 'Error uploading image' });
      }
      console.log('Image uploaded successfully');
      next();
    });
  };
};
exports.uploadArrayOfImages = (fieldName) => multerOptions().array(fieldName, 5);
