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
            // res.redirect('/dashboard');
            res.json({
                message: 'Welcome',
            });
        },
    },
];

module.exports = (app) => {
    routes.forEach((route) => {
        if (route.path === '/') {
            app.get(route.path, route.controller);
        } else {
            app.use(route.path, route.controller);
        }
    });
};
