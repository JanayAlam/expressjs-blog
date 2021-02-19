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
    console.log(req.session);
    res.render('pages/auth/login', {
        title: 'Login',
        error: {},
        value: {},
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
    let errors = validationResult(req).formatWith(formatter);

    if (!errors.isEmpty()) {
        return res.render('pages/auth/login', {
            title: 'Login',
            error: errors.mapped(),
            value: {
                email,
                password,
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
                value: { email, password },
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
                value: { email, password },
            });
        }

        req.session.isLoggedIn = true;
        req.session.user = user;

        res.render('pages/auth/login', {
            title: 'Login',
            error: {},
            value: {},
        });
    } catch (e) {
        console.log(e);
        next(e);
    }
};

auth.logoutController = (req, res, next) => {};

module.exports = auth;
