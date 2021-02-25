const User = require('../models/User');

const middleware = {};

middleware.bindUserWithRequest = () => {
    return async (req, res, next) => {
        if (!req.session.isLoggedIn) {
            return next();
        }

        try {
            const user = await User.findById(req.session.user._id);
            req.user = user;
            next();
        } catch (e) {
            next(e);
        }
    };
};

middleware.isAuthenticated = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/auth/login');
    }
    next();
};

module.exports = middleware;
