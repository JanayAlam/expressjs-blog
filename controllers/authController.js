// encription
const bcrypt = require('bcrypt');

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
        title: 'Signup',
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

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword,
        });
        const createdUser = await user.save();
        console.log('User Created', createdUser);
        res.render('pages/auth/login', {
            title: 'Signup',
            error: {},
        });
    } catch (e) {
        console.log(e);
        next(e);
    }
};

auth.loginGetController = (req, res, next) => {
    res.render('pages/auth/login', {
        title: 'Login',
        error: {},
    });
};
auth.loginPostController = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email) {
        return res.render('pages/auth/login', {
            title: 'Login',
            error: {
                email: 'Email filed is required',
            },
        });
    }

    if (!password) {
        return res.render('pages/auth/login', {
            title: 'Login',
            error: {
                password: 'Password filed is required',
            },
        });
    }

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.render('pages/auth/login', {
                title: 'Login',
                error: {
                    email: 'Invalid Credential',
                    password: 'Invalid Credential',
                },
            });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.render('pages/auth/login', {
                title: 'Login',
                error: {
                    email: 'Invalid Credential',
                    password: 'Invalid Credential',
                },
            });
        }
        res.render('pages/auth/login', {
            title: 'Login',
            error: {},
        });
    } catch (e) {
        console.log(e);
        next(e);
    }
};

auth.logoutController = (req, res, next) => {};

module.exports = auth;
