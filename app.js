require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const chalk = require('chalk');

// middlewares
const setMiddleware = require('./middleware/middlewares');

// import routes
const setRoute = require('./routes/route');

const app = express();

const DB_URI = `mongodb+srv://${config.get('db-username')}:${config.get(
    'db-password'
)}@cluster0.8ez2y.mongodb.net/${config.get(
    'db-name'
)}?retryWrites=true&w=majority`;

// view engine setup
app.set('view engine', 'ejs');
app.set('views', 'views');

// using middleware from middlware/middlwares file
setMiddleware(app);

// using routes from routes/route file
setRoute(app);

app.use((req, res, next) => {
    const error = new Error('404 page not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    if (error.status === 404) {
        return res.render('pages/error/notFound.ejs', {
            flashMessage: {},
            title: 'Not Found',
        });
    }
});

const PORT = process.env.PORT || 8080;

mongoose
    .connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(chalk.green(`Database connected`));
            console.log(`Server is running on PORT ${PORT}`);
            console.log('Visit: ' + chalk.green(`http://localhost:${PORT}`));
        });
    })
    .catch((e) => {
        console.log(e);
    });
