// models
const User = require('../models/User');

// module sraffolding
const dash = {};

dash.dashboardGetController = (req, res, next) => {
    res.render('pages/dashboard/dashboard.ejs', {
        title: 'Dashboard',
    });
};

module.exports = dash;
