// dependencies
const express = require('express');
const morgan = require('morgan');
const flash = require('connect-flash');

// session
const session = require('express-session');

// database
const MongoDBStore = require('connect-mongodb-session')(session);

// configuration
const config = require('config');

// middleware
const { bindUserWithRequest } = require('./authMiddleware');
const { bindLoggedIn } = require('./setLocals');

// database URI
const DB_URI = `mongodb+srv://${config.get('db-username')}:${config.get(
    'db-password'
)}@cluster0.8ez2y.mongodb.net/${config.get(
    'db-name'
)}?retryWrites=true&w=majority`;

// session store configuration
const store = new MongoDBStore({
    uri: DB_URI,
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 24, // ms * s * m * h
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
    flash(),
    bindUserWithRequest(),
    bindLoggedIn(),
];

module.exports = (app) => {
    middlewares.forEach((middleware) => {
        app.use(middleware);
    });
};
