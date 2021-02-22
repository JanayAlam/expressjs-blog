const router = require('express').Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const { postValidator } = require('../validator/dashboard/post/postValidator');
const {
    createPostGetController,
    createPostPostController,
} = require('../controllers/postController');
const upload = require('../middleware/uploadMiddleware');

router.get('/create', isAuthenticated, createPostGetController);
router.post(
    '/create',
    isAuthenticated,
    upload.single('thumbnail'),
    postValidator,
    createPostPostController
);

module.exports = router;
