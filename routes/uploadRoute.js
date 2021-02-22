const router = require('express').Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
    removeProfilePhoto,
    uploadProfilePhoto,
    postPhotoUpload,
} = require('../controllers/uploadController');

router.post(
    '/profilePhoto',
    isAuthenticated,
    upload.single('profilePhoto'),
    uploadProfilePhoto
);

router.delete('/profilePhoto', isAuthenticated, removeProfilePhoto);

router.post(
    '/post-image',
    isAuthenticated,
    upload.single('post-image'),
    postPhotoUpload
);

module.exports = router;
