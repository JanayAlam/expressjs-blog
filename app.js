// applications
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

// import routes
const authRoute = require('./routes/authRoute');

const app = express();

// view engine setup
app.set('view engine', 'ejs');
app.set('views', 'views');

// middleware Array
const middleware = [
    morgan('dev'),
    express.static('public'),
    express.urlencoded({ extended: true }),
    express.json(),
];

app.use(middleware);

// routing
app.use('/auth', authRoute);

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome',
    });
});

const PORT = process.env.PORT || 8080;

mongoose
    .connect(
        'mongodb+srv://kryptonite:Alam-1234@cluster0.8ez2y.mongodb.net/ex-blog-db?retryWrites=true&w=majority',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on PORT ${PORT}`);
        });
    })
    .catch((e) => {
        console.log(e);
    });
