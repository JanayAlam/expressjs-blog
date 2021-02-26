// models
const User = require('../models/User');

// module scaffolding
const middleware = {};

/**
 * Bind user With The Request
 *
 * Bind the user will all request form client automatically
 *
 * @returns {function(*, *, *): Promise<*|undefined>}
 */
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

/**
 * Authentication Middleware
 *
 * Block the request if the client is not logged in
 *
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 * @returns {*}
 */
middleware.isAuthenticated = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/auth/login');
    }
    next();
};

module.exports = middleware;
