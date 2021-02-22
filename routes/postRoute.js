const router = require('express').Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const {
    createPostGetController,
    createPostPostController,
} = require('../controllers/postController');

router.get('/create', isAuthenticated, createPostGetController);
router.post('/create', isAuthenticated, createPostPostController);

module.exports = router;
