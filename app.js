// dependencies
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

// database
const mongoose = require('mongoose');

// 3rd party
const falsh = require('connect-flash');

// session
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// import routes
const authRoute = require('./routes/authRoute');
const dashboardRoute = require('./routes/dashboardRoute');

// playground route
// const validatorRoute = require('./playground/validator'); // @TODO Delete later

const app = express();

// setting morgan to only perform in development environment
if (app.get('env').toLowerCase() === 'development') {
    app.use(morgan('dev'));
}

// middlewares
const { bindUserWithRequest } = require('./middleware/authMiddleware');
const { bindLoggedIn } = require('./middleware/setLocals');

const DB_URI = `mongodb+srv://${process.env.DB_ADMIN}:${process.env.DB_PASSWORD}@cluster0.8ez2y.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// session store config
const store = new MongoDBStore({
    uri: DB_URI,
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 2, // ms * s * m * h
});

// middleware Array
const middleware = [
    morgan('dev'),
    express.static('public'),
    express.urlencoded({ extended: true }),
    express.json(),
    session({
        secret: process.env.SECRET_KEY || 'SECRET_KEY',
        resave: false,
        saveUninitialized: false,
        store: store,
    }),
    bindUserWithRequest(),
    bindLoggedIn(),
    falsh(),
];

// view engine setup
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(middleware);

// routing
app.use('/auth', authRoute);
app.use('/dashboard', dashboardRoute);
// app.use('/playground', validatorRoute); // @TODO Delete later

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome',
    });
});

const PORT = process.env.PORT || 8080;

mongoose
    .connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Database connected`);
            console.log(`Server is running on PORT ${PORT}`);
            console.log(`http://localhost:${PORT}`);
        });
    })
    .catch((e) => {
        console.log(e);
    });
