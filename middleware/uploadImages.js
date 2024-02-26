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
      if (!req.file) {
        console.error('No file uploaded');
        return res.status(400).json({ error: 'No file uploaded' });
      }
      console.log('Image uploaded successfully');
      next();
    });
  };
};
exports.uploadArrayOfImages = (fieldName) => {
  return (req, res, next) => {
    multerOptions().array(fieldName, { min: 3 })(req, res, function (err) {
      if (err) {
        console.error('Error uploading images:', err);
        return res.status(400).json({ error: 'Error uploading images' });
      }
      if (!req.files || req.files.length === 0) {
        console.error('No files uploaded');
        return res.status(400).json({ error: 'No files uploaded' });
      }
      next(); // Call next to pass control to the next middleware in the chain
    });
  };
};
exports.validateImageCount = (req, res, next) => {
  if (!req.files) {
    return res.status(400).json({ error: 'No files were uploaded.' });
  }

  const fileCount = req.files.length;
  if (fileCount < 3) {
    return res.status(400).json({ error: 'At least 3 images are required.' });
  }
  if (fileCount > 5) {
    return res.status(400).json({ error: 'Only 5 images are allowed.' });
  }

  next();
};
