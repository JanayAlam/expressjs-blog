const authRoute = require('./authRoute');
const dashboardRoute = require('./dashboardRoute');
const playgroundRoute = require('../playground/play');
const uploadRoute = require('./uploadRoute');
const postRoute = require('./postRoute');
const apiRoute = require('../api/routes/apiRoute');
const exploreRoute = require('./exploreRoute');
const searchRoute = require('./searchRoute');

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
        path: '/uploads',
        controller: uploadRoute,
    },
    {
        path: '/explore',
        controller: exploreRoute,
    },
    {
        path: '/api',
        controller: apiRoute,
    },
    {
        path: '/playground',
        controller: playgroundRoute,
    },
    {
        path: '/posts',
        controller: postRoute,
    },
    {
        path: '/search',
        controller: searchRoute,
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
