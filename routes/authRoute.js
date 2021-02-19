// dependencies
const router = require('express').Router();
const { signupValidator } = require('../validator/auth/signupValidator');
const { loginValidator } = require('../validator/auth/loginValidator');
const {
    signupGetController,
    signupPostController,
    loginGetController,
    loginPostController,
    logoutController,
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

// exporting module
module.exports = router;
