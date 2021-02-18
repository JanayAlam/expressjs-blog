// models
const User = require('../models/User');

// module sraffolding
const auth = {};

/**
 * Signup get controller
 * Render the signup page
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
auth.signupGetController = (req, res, next) => {
    res.render('pages/auth/signup', {
        title: 'Create a new accout',
        error: {},
    });
};

/**
 * Signup post controller
 * Handle the post request from signup form
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
auth.signupPostController = async (req, res, next) => {
    let { username, email, password, confirmPassword } = req.body;
    let error = {};

    // all required validation
    if (username) {
        if (username.trim().length > 15) {
            error.username = 'Username must be lesser then 15 characters';
        }
    } else {
        error.username = 'Username is required';
    }

    if (!email) {
        error.email = 'Email is required';
    }

    if (!password) {
        error.password = 'Password is required';
    }

    if (password !== confirmPassword) {
        error.confirmPassword = 'Password did not matched';
    }

    const isError = Object.keys(error).length > 0;

    if (isError) {
        return res.render('pages/auth/signup', {
            title: 'Create a new accout',
            error,
        });
    }

    const user = new User({
        username,
        email,
        password,
    });

    try {
        const createdUser = await user.save();
        console.log('User Created', createdUser);
        res.render('pages/auth/signup', {
            title: 'Create a new accout',
            error: {},
        });
    } catch (e) {
        console.log(e);
        next(e);
    }
};

auth.loginGetController = (req, res, next) => {};
auth.loginPostController = (req, res, next) => {};

auth.logoutController = (req, res, next) => {};

module.exports = auth;
