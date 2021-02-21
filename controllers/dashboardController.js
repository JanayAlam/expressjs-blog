const { validationResult } = require('express-validator');
// utils
const Flash = require('../utils/Flash');
const { formatter } = require('../utils/validationErrorFormatter');

// models
const Profile = require('../models/Profile');

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
        res.redirect('dashboard/create-profile');
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
        res.render('pages/dashboard/create-profile', {
            title: 'Create Profile',
            flashMessage: Flash.getMessage(req),
        });
    } catch (e) {
        next(e);
    }
};

dash.createProfilePostController = async (req, res, next) => {
    const errors = validationResult(req).formatWith(formatter);
    console.log(errors.mapped());

    res.render('pages/dashboard/create-profile', {
        title: 'Create Profile',
        flashMessage: Flash.getMessage(req),
    });
};

dash.editProfileGetController = async (req, res, next) => {};

dash.editProfilePostController = async (req, res, next) => {};

module.exports = dash;
