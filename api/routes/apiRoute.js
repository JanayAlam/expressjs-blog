const router = require('express').Router();
const { isAuthenticated } = require('../../middleware/authMiddleware');
const {
    createCommentController,
    createReplyController,
} = require('../controllers/commentController');
const {
    getLikes,
    getDislikes,
} = require('../controllers/likeDislikeController');
const { addBookmark } = require('../controllers/bookmarkController');

router.post('/comments/:postId', isAuthenticated, createCommentController);
router.post(
    '/comments/replies/:commentId',
    isAuthenticated,
    createReplyController
);

router.get('/likes/:postId', isAuthenticated, getLikes);
router.get('/dislikes/:postId', isAuthenticated, getDislikes);

router.get('/bookmarks/:postId', isAuthenticated, addBookmark);

module.exports = router;
