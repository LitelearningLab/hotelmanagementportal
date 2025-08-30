const multer = require("multer");


let storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel' // .xls
    ];
    const allowedExtensions = ['.xlsx', '.xls'];

    const mimeTypeIsValid = allowedMimeTypes.includes(file.mimetype);
    const extensionIsValid = allowedExtensions.some(extension => file.originalname.endsWith(extension));

    if (mimeTypeIsValid && extensionIsValid) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only Excel files are allowed.'), false);
    }
};


//image upload to the public image files folder

const path = require('path');

const storages = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        // Extract file extension
    
        const ext = path.extname(file.originalname);
        
        
        // Construct filename with original field name, timestamp, and extension
        cb(null,Date.now() + '-' +file.originalname );
    }
});

const uploads = multer({ storage: storages });

let upload = multer({ storage: storage ,
    fileFilter:fileFilter //for filtering the file than we have sent to the multer only excel file are accepted here
});

module.exports = {
    upload,
    uploads
};
