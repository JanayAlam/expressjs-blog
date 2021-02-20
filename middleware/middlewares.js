const express = require('express');
const morgan = require('morgan');
const falsh = require('connect-flash');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const config = require('config');

const { bindUserWithRequest } = require('./authMiddleware');
const { bindLoggedIn } = require('./setLocals');

const DB_URI = `mongodb+srv://${config.get('db-username')}:${config.get(
    'db-password'
)}@cluster0.8ez2y.mongodb.net/${config.get(
    'db-name'
)}?retryWrites=true&w=majority`;

// session store config
const store = new MongoDBStore({
    uri: DB_URI,
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 2, // ms * s * m * h
});

const middlewares = [
    morgan('dev'),
    express.static('public'),
    express.urlencoded({ extended: true }),
    express.json(),
    session({
        secret: config.get('secret-key'),
        resave: false,
        saveUninitialized: false,
        store: store,
    }),
    falsh(),
    bindUserWithRequest(),
    bindLoggedIn(),
];

module.exports = (app) => {
    middlewares.forEach((middleware) => {
        app.use(middleware);
    });
};
