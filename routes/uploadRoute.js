const router = require('express').Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { uploadProfilePhoto } = require('../controllers/uploadController');

router.post(
    '/profilePhoto',
    isAuthenticated,
    upload.single('profilePhoto'),
    uploadProfilePhoto
);

module.exports = router;
