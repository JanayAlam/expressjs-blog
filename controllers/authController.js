// encription
const bcrypt = require('bcrypt');

// validation
const { validationResult } = require('express-validator');

// models
const User = require('../models/User');

// utils
const { formatter } = require('../utils/validationErrorFormatter');

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
        value: {},
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
    let { username, email, password } = req.body;
    let errors = validationResult(req).formatWith(formatter);

    if (!errors.isEmpty()) {
        return res.render('pages/auth/signup', {
            title: 'Signup',
            error: errors.mapped(),
            value: {
                username,
                email,
            },
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
        return res.render('pages/auth/login', {
            title: 'Login',
            error: {},
            value: {},
        });
    } catch (e) {
        console.log(e);
        next(e);
    }
};

/**
 * Login get controller
 * Render the login page
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
auth.loginGetController = (req, res, next) => {
    res.render('pages/auth/login', {
        title: 'Login',
        error: {},
    });
};

/**
 * Login post controller
 * Handle the post request from login form
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
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
