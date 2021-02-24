const router = require('express').Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const { postValidator } = require('../validator/dashboard/post/postValidator');
const {
    getPosts,
    createPostGetController,
    createPostPostController,
    editPostGetController,
    editPostPostController,
    deletePostController,
} = require('../controllers/postController');
const upload = require('../middleware/uploadMiddleware');

router.get('/', isAuthenticated, getPosts);

router.get('/create', isAuthenticated, createPostGetController);

router.post(
    '/create',
    isAuthenticated,
    upload.single('thumbnail'),
    postValidator,
    createPostPostController
);

router.get(
    '/edit/:id',
    isAuthenticated,
    upload.single('thumbnail'),
    postValidator,
    editPostGetController
);

router.post(
    '/edit/:id',
    isAuthenticated,
    upload.single('thumbnail'),
    postValidator,
    editPostPostController
);

router.get('/delete/:id', isAuthenticated, deletePostController);

module.exports = router;
