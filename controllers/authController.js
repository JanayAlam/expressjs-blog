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
 * Signup GET Controller
 *
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
 * Signup POST Controller
 *
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
 * Login GET Controller
 *
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
 * Login POST Controller
 *
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
            return res.render('pages/auth/login.ejs', {
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
 * Logout Controller
 *
 * Kill the session of the user from database
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

/**
 * Chnage Password GET Controller
 *
 * Render the chnage password form view
 *
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 */
auth.getChangePasswordController = (req, res, next) => {
    return res.render('pages/auth/change-password.ejs', {
        title: 'Chnage Password',
        error: {},
        flashMessage: Flash.getMessage(req),
    });
};

/**
 * Chnage Password POST Controller
 *
 * Change the user's password into the database
 *
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 */
auth.changePasswordController = async (req, res, next) => {
    const userId = req.user._id;
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const errors = validationResult(req).formatWith(formatter);

    if (!errors.isEmpty()) {
        req.flash('fail', 'Please check your data');
        return res.render('pages/auth/change-password.ejs', {
            title: 'Change Password',
            error: errors.mapped(),
            flashMessage: Flash.getMessage(req),
        });
    }

    try {
        const user = await User.findById(userId);

        // checking the old password did matched or not
        const isMatched = await bcrypt.compare(oldPassword, user.password);
        if (!isMatched) {
            return res.render('pages/auth/change-password.ejs', {
                title: 'Change Password',
                error: {
                    oldPassword: 'Did not match with your password',
                },
                flashMessage: Flash.getMessage(req),
            });
        }

        // update the password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findOneAndUpdate(
            { _id: userId },
            {
                $set: { password: hashedPassword },
            }
        );
        return res.redirect('/auth/change-password');
    } catch (e) {
        next(e);
    }
};

module.exports = auth;
