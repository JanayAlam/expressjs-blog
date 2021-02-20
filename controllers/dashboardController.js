// utils
const Flash = require('../utils/Flash');

// models
const User = require('../models/User');

// module sraffolding
const dash = {};

dash.dashboardGetController = (req, res, next) => {
    res.render('pages/dashboard/dashboard.ejs', {
        title: 'Dashboard',
        flashMessage: Flash.getMessage(req),
    });
};

module.exports = dash;
