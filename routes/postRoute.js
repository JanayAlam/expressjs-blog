const router = require('express').Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const { postValidator } = require('../validator/dashboard/post/postValidator');
const {
    createPostGetController,
    createPostPostController,
    editPostGetController,
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

router.get('/edit/:id', editPostGetController);

module.exports = router;
