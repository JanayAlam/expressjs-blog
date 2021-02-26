// module scaffolding
const middleware = {};

/**
 * Authentication Middleware
 *
 * Make sure the client is unauthorized
 *
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 * @returns {*}
 */
middleware.isUnauthenticated = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/dashboard');
    }
    next();
};

module.exports = middleware;
