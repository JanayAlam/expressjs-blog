const Flash = require('../utils/Flash');
const { validationResult } = require('express-validator');
const { formatter } = require('../utils/validationErrorFormatter');
const Post = require('../models/Post');
const readingTime = require('reading-time');
const Profile = require('../models/Profile');

const post = {};

post.createPostGetController = (req, res, next) => {
    return res.render('pages/dashboard/post/create-post.ejs', {
        title: 'Create Post',
        error: {},
        value: {},
        flashMessage: Flash.getMessage(req),
    });
};

post.createPostPostController = async (req, res, next) => {
    let { title, body, tags } = req.body;
    const errors = validationResult(req).formatWith(formatter);
    if (!errors.isEmpty()) {
        req.flash('fail', 'Please check your data');
        return res.render('pages/dashboard/post/create-post.ejs', {
            title: 'Create Post',
            error: errors.mapped(),
            value: {
                title,
                body,
                tags,
            },
            flashMessage: Flash.getMessage(req),
        });
    }

    // making tags string to array
    if (tags) {
        tags = tags.split(',');
    }

    // read time
    const readTime = readingTime(body).text;

    let post = new Post({
        title,
        body,
        author: req.user._id,
        tags,
        thumbnail: '',
        readTime,
        likes: [],
        dislikes: [],
        comments: [],
    });

    if (req.file) {
        post.thumbnail = `/uploads/${req.file.filename}`;
    }

    // saving post and updating profile
    try {
        const createdPost = await post.save();
        // updating the profile
        await Profile.findOneAndUpdate(
            { user: req.user._id },
            { $push: { posts: createdPost._id } }
        );
        return res.redirect(`/posts/edit-post/${createdPost._id}`);
    } catch (e) {
        next(e);
    }
};

module.exports = post;
