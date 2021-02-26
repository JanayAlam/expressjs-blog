const { validationResult } = require('express-validator');
// utils
const Flash = require('../utils/Flash');
const { formatter } = require('../utils/validationErrorFormatter');

// models
const Profile = require('../models/Profile');
const User = require('../models/User');

// module scaffolding
const dash = {};

/**
 * Dashboard GET Controller
 *
 * Render the dashboard page
 *
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 * @returns {Promise<*>} render the dashboard.ejs file
 */
dash.dashboardGetController = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        if (profile) {
            return res.render('pages/dashboard/dashboard.ejs', {
                title: 'Dashboard',
                flashMessage: Flash.getMessage(req),
            });
        }
        res.redirect('dashboard/create-profile');
    } catch (e) {
        next(e);
    }
};

/**
 * Create Profile GET Controller
 *
 * Render the create profile form page
 *
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 * @returns {Promise<*>} render the create-profile.ejs file
 */
dash.createProfileGetController = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        if (profile) {
            return res.redirect('/dashboard/edit-profile');
        }
        res.render('pages/dashboard/create-profile.ejs', {
            title: 'Create Profile',
            error: {},
            value: {},
            flashMessage: Flash.getMessage(req),
        });
    } catch (e) {
        next(e);
    }
};

/**
 * Create Profile POST Controller
 *
 * Handle create profile post request. Save the profile of the user into database
 * with validation of the request object
 *
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 * @returns {Promise<*>} redirect to dashboard
 */
dash.createProfilePostController = async (req, res, next) => {
    const errors = validationResult(req).formatWith(formatter);

    const {
        firstName,
        lastName,
        title,
        bio,
        website,
        linkedin,
        facebook,
        twitter,
        github,
    } = req.body;

    if (!errors.isEmpty()) {
        req.flash('fail', 'Please check your data');
        return res.render('pages/dashboard/create-profile.ejs', {
            title: 'Create Profile',
            error: errors.mapped(),
            value: {
                firstName,
                lastName,
                title,
                bio,
                website,
                linkedin,
                facebook,
                twitter,
                github,
            },
            flashMessage: Flash.getMessage(req),
        });
    }

    try {
        const profile = new Profile({
            user: req.user._id,
            firstName,
            lastName,
            title,
            bio,
            profilePhoto: req.user.profilePhoto,
            links: {
                website,
                linkedin,
                facebook,
                twitter,
                github,
            },
        });
        const createdProfile = await profile.save();
        await User.findOneAndUpdate(
            { _id: req.user._id },
            {
                $set: {
                    profile: createdProfile._id,
                },
            }
        );
        req.flash('success', 'Profile created successfully');
        return res.redirect('/dashboard');
    } catch (e) {
        next(e);
    }
};

/**
 * Edit Profile GET Controller
 *
 * Render the edit profile form view
 *
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 * @returns {Promise<*>} render the edit-profile.ejs file
 */
dash.editProfileGetController = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res.redirect('dashboard/create-profile');
        }
        res.render('pages/dashboard/edit-profile.ejs', {
            title: 'Edit Profile',
            error: {},
            profile,
            flashMessage: Flash.getMessage(req),
        });
    } catch (e) {
        next(e);
    }
};

/**
 * Edit Profile POST Controller
 *
 * Update the user profile into the database
 *
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 * @returns {Promise<*>} render the edit-profile.ejs file with new value
 */
dash.editProfilePostController = async (req, res, next) => {
    const errors = validationResult(req).formatWith(formatter);
    const {
        firstName,
        lastName,
        title,
        bio,
        website,
        linkedin,
        facebook,
        twitter,
        github,
    } = req.body;

    if (!errors.isEmpty()) {
        req.flash('fail', 'Please check your data');
        return res.render('pages/dashboard/edit-profile.ejs', {
            title: 'Edit Profile',
            error: errors.mapped(),
            profile: {
                firstName,
                lastName,
                title,
                bio,
                links: {
                    website,
                    linkedin,
                    facebook,
                    twitter,
                    github,
                },
            },
            flashMessage: Flash.getMessage(req),
        });
    }
    try {
        const updatedProfile = await Profile.findOneAndUpdate(
            { _id: req.user.profile },
            {
                $set: {
                    firstName,
                    lastName,
                    title,
                    bio,
                    links: {
                        website,
                        linkedin,
                        facebook,
                        twitter,
                        github,
                    },
                },
            },
            {
                new: true,
            }
        );
        req.flash('success', 'Profile updated successfully');
        return res.render('pages/dashboard/edit-profile.ejs', {
            title: 'Edit Profile',
            error: errors.mapped(),
            profile: updatedProfile,
            flashMessage: Flash.getMessage(req),
        });
    } catch (e) {
        next(e);
    }
};

module.exports = dash;
