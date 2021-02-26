// encryption
const bcrypt = require('bcrypt');

// validation
const { validationResult } = require('express-validator');

// models
const User = require('../models/User');

// utils
const { formatter } = require('../utils/validationErrorFormatter');
const Flash = require('../utils/Flash');

// module scaffolding
const auth = {};

/**
 * Signup get controller
 * Render the signup page
 *
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 */
auth.signupGetController = (req, res, next) => {
    res.render('pages/auth/signup', {
        title: 'Signup',
        error: {},
        value: {},
        flashMessage: Flash.getMessage(req),
    });
};

/**
 * Signup post controller
 * Handle the post request from signup form
 *
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 */
auth.signupPostController = async (req, res, next) => {
    let { username, email, password } = req.body;
    let errors = validationResult(req).formatWith(formatter);

    if (!errors.isEmpty()) {
        req.flash('fail', 'Please check your data');
        return res.render('pages/auth/signup', {
            title: 'Signup',
            error: errors.mapped(),
            value: {
                username,
                email,
            },
            flashMessage: Flash.getMessage(req),
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword,
        });
        await user.save();
        req.flash('success', 'User created successfully');
        return res.redirect('/auth/login');
    } catch (e) {
        next(e);
    }
};

/**
 * Login get controller
 * Render the login page
 *
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 */
auth.loginGetController = (req, res, next) => {
    res.render('pages/auth/login', {
        title: 'Login',
        error: {},
        value: {},
        flashMessage: Flash.getMessage(req),
    });
};

/**
 * Login post controller
 * Handle the post request from login form
 *
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 */
auth.loginPostController = async (req, res, next) => {
    const { email, password } = req.body;
    let errors = validationResult(req).formatWith(formatter);

    if (!errors.isEmpty()) {
        req.flash('fail', 'Please check your data');
        return res.render('pages/auth/login', {
            title: 'Login',
            error: errors.mapped(),
            value: {
                email,
                password,
            },
            flashMessage: Flash.getMessage(req),
        });
    }

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            req.flash('fail', 'Please provide valid Credentials');
            return res.render('pages/auth/login', {
                title: 'Login',
                error: {
                    email: 'Invalid Credential',
                    password: 'Invalid Credential',
                },
                value: { email, password },
                flashMessage: Flash.getMessage(req),
            });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            req.flash('fail', 'Please provide valid Credentials');
            return res.render('pages/auth/login', {
                title: 'Login',
                error: {
                    email: 'Invalid Credential',
                    password: 'Invalid Credential',
                },
                value: { email, password },
                flashMessage: Flash.getMessage(req),
            });
        }

        // set user status to logged-in
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save((error) => {
            if (error) {
                console.log(error);
                return next();
            }
            req.flash('success', 'Successfully logged in');
            res.redirect('/dashboard');
        });
    } catch (e) {
        next(e);
    }
};

/**
 * Logout controller
 * Handle the logout request from user
 *
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 */
auth.logoutController = (req, res, next) => {
    req.session.destroy((error) => {
        if (error) {
            return next();
        }
        return res.redirect('/auth/login');
    });
};

module.exports = auth;
