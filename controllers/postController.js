const Flash = require('../utils/Flash');

const post = {};

post.createPostGetController = (req, res, next) => {
    return res.render('pages/dashboard/post/create-post.ejs', {
        title: 'Create Post',
        error: {},
        value: {},
        flashMessage: Flash.getMessage(req),
    });
};

post.createPostPostController = (req, res, next) => {};

module.exports = post;
