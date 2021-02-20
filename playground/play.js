const router = require('express').Router();
const upload = require('../middleware/uploadMiddleware');

router.get('/play', (req, res, next) => {
    return res.render('playground/play.ejs', {
        title: 'Playground',
        flashMessage: {},
        value: {},
    });
});

router.post('/play', upload.single('image-file'), (req, res, next) => {
    if (req.file) {
        console.log(req.file);
    }
    res.redirect('/playground/play');
});

module.exports = router;
