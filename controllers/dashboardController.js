const { validationResult } = require('express-validator');
// utils
const Flash = require('../utils/Flash');
const { formatter } = require('../utils/validationErrorFormatter');

// models
const Profile = require('../models/Profile');
const User = require('../models/User');
const { set } = require('mongoose');

// module sraffolding
const dash = {};

dash.dashboardGetController = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        if (profile) {
            return res.render('pages/dashboard/dashboard.ejs', {
                title: 'Dashboard',
                flashMessage: Flash.getMessage(req),
            });
        }
        res.redirect('dashboard/create-profile.ejs');
    } catch (e) {
        next(e);
    }
};

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

dash.editProfileGetController = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res.redirect('dashboard/create-profile');
        }
        const { firstName, lastName, title, bio, links } = profile;
        const { facebook, twitter, linkedin, website, github } = links;
        res.render('pages/dashboard/edit-profile.ejs', {
            title: 'Edit Profile',
            error: {},
            value: {
                firstName,
                lastName,
                title,
                bio,
                facebook,
                twitter,
                linkedin,
                website,
                github,
            },
            flashMessage: Flash.getMessage(req),
        });
    } catch (e) {
        next(e);
    }
};

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
        await Profile.findOneAndUpdate(
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
            }
        );
        return res.redirect('/dashboard');
    } catch (e) {
        next(e);
    }
};

module.exports = dash;
