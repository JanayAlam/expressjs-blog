const authRoute = require('./authRoute');
const dashboardRoute = require('./dashboardRoute');

const routes = [
    {
        path: '/auth',
        controller: authRoute,
    },
    {
        path: '/dashboard',
        controller: dashboardRoute,
    },
    {
        path: '/',
        controller: (req, res, next) => {
            res.redirect('/dashboard');
        },
    },
];

module.exports = (app) => {
    routes.forEach((route) => {
        app.use(route.path, route.controller);
    });
};
