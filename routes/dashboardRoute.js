const router = require('express').Router();

// middleware
const { isAuthenticated } = require('../middleware/authMiddleware');
const { profileValidator } = require('../validator/dashboard/profileValidator');

const {
    dashboardGetController,
    createProfileGetController,
    createProfilePostController,
    editProfileGetController,
    editProfilePostController,
    getBookmarks,
} = require('../controllers/dashboardController');

router.get('/bookmarks', isAuthenticated, getBookmarks);

router.get('/create-profile', isAuthenticated, createProfileGetController);
router.post(
    '/create-profile',
    isAuthenticated,
    profileValidator,
    createProfilePostController
);

router.get('/edit-profile', isAuthenticated, editProfileGetController);
router.post(
    '/edit-profile',
    isAuthenticated,
    profileValidator,
    editProfilePostController
);

router.get('/', isAuthenticated, dashboardGetController);

module.exports = router;
