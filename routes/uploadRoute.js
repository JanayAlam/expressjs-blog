const router = require('express').Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
    removeProfilePhoto,
    uploadProfilePhoto,
} = require('../controllers/uploadController');

router.post(
    '/profilePhoto',
    isAuthenticated,
    upload.single('profilePhoto'),
    uploadProfilePhoto
);

router.delete('/profilePhoto', isAuthenticated, removeProfilePhoto);

module.exports = router;
