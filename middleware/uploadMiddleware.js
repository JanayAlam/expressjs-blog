// dependencies
const multer = require('multer');
const path = require('path');

/**
 * Storage Function
 *
 * Config the diskStorage method of multer
 *
 * @type {*|DiskStorage}
 */
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/uploads');
    },
    filename: (req, file, callback) => {
        callback(
            null,
            file.fieldname + '-' + Date.now() + '-' + file.originalname
        );
    },
});

/**
 * Upload middleware for multipart form data
 *
 * Multipart form data image uploader
 *
 * @type {Multer|*}
 */
const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // kilobyte * megabyte * 5mb
    },
    fileFilter: (req, file, callback) => {
        const types = /jpeg|jpg|png|gif/;
        const extensionName = types.test(
            path.extname(file.originalname).toLowerCase()
        );
        const mimeType = types.test(file.mimetype);

        if (extensionName && mimeType) {
            callback(null, true);
        } else {
            callback(new Error('Only support images'));
        }
    },
});

module.exports = upload;
