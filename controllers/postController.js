const Flash = require('../utils/Flash');
const { validationResult } = require('express-validator');
const { formatter } = require('../utils/validationErrorFormatter');
const Post = require('../models/Post');
const readingTime = require('reading-time');
const Profile = require('../models/Profile');
const fs = require('fs');
const error = require('../utils/validationErrorFormatter');

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
        tags = tags.map((tag) => tag.trim());
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
        req.flash('success', 'Post created successfully');
        return res.redirect(`/posts/edit/${createdPost._id}`);
    } catch (e) {
        next(e);
    }
};

post.editPostGetController = async (req, res, next) => {
    try {
        const post = await Post.findOne({
            author: req.user._id,
            _id: req.params.id,
        });
        if (!post) {
            let error = new Error(
                'Post not found or user have no access on it'
            );
            error.status = 404;
            throw error;
        }
        return res.render('pages/dashboard/post/edit-post.ejs', {
            title: 'Edit Post',
            error: {},
            post,
            flashMessage: Flash.getMessage(req),
        });
    } catch (e) {
        next(e);
    }
};

post.editPostPostController = async (req, res, next) => {
    try {
        let post = await Post.findOne({
            author: req.user._id,
            _id: req.params.id,
        });
        if (!post) {
            let error = new Error(
                'Post not found or user have no access on it'
            );
            error.status = 404;
            throw error;
        }

        let { title, body, tags } = req.body;

        // error handling
        const errors = validationResult(req).formatWith(formatter);
        if (!errors.isEmpty()) {
            req.flash('fail', 'Please check your data');
            return res.render('pages/dashboard/post/edit-post.ejs', {
                title: 'Edit Post',
                error: errors.mapped(),
                post,
                flashMessage: Flash.getMessage(req),
            });
        }

        // making tags string to array
        if (tags) {
            tags = tags.split(',');
            tags = tags.map((tag) => tag.trim());
        }

        // read time
        const readTime = readingTime(body).text;

        let updatedPost = {
            title,
            body,
            tags,
            author: req.user._id,
            thumbnail: post.thumbnail,
            readTime,
            likes: post.likes,
            dislikes: post.dislikes,
            comments: post.comments,
        };

        // file
        if (req.file) {
            fs.unlink(`public/${post.thumbnail}`, (error) => {
                if (error) {
                    error.status = 500;
                    throw error;
                }
            });
            updatedPost.thumbnail = `/uploads/${req.file.filename}`;
        }

        // saving post and updating profile
        const newPost = await Post.findOneAndUpdate(
            { _id: post._id },
            { $set: updatedPost },
            { new: true }
        );
        req.flash('success', 'Post updated successfully');
        return res.render('pages/dashboard/post/edit-post.ejs', {
            title: 'Edit Post',
            error: {},
            post: newPost,
            flashMessage: Flash.getMessage(req),
        });
    } catch (e) {
        next(e);
    }
};

module.exports = post;
