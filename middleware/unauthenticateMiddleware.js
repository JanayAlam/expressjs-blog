const middleware = {};

middleware.isUnauthenticated = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/dashboard');
    }
    next();
};

module.exports = middleware;
