// dependencies
const router = require('express').Router();
const { signupValidator } = require('../validator/auth/signupValidator');
const { loginValidator } = require('../validator/auth/loginValidator');
const { changePassword } = require('../validator/auth/changePasswordValidator');
const {
    signupGetController,
    signupPostController,
    loginGetController,
    loginPostController,
    logoutController,
    getChangePasswordController,
    changePasswordController,
} = require('../controllers/authController');
const { isUnauthenticated } = require('../middleware/unauthenticateMiddleware');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/signup', isUnauthenticated, signupGetController);
router.post(
    '/signup',
    isUnauthenticated,
    signupValidator,
    signupPostController
);
router.get('/login', isUnauthenticated, loginGetController);
router.post('/login', isUnauthenticated, loginValidator, loginPostController);
router.get('/logout', isAuthenticated, logoutController);

router.get('/change-password', isAuthenticated, getChangePasswordController);
router.post(
    '/change-password',
    isAuthenticated,
    changePassword,
    changePasswordController
);

// exporting module
module.exports = router;
