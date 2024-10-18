const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/', // Directory to store images
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Check file type (optional)
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Max file size 1MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image'); // 'image' is the name of the form field

module.exports = upload;
