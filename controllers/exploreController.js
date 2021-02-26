// dependencies
const moment = require('moment');

// utils
const Flash = require('../utils/Flash');

// models
const Post = require('../models/Post');
const Profile = require('../models/Profile');

// module scaffolding
const explore = {};

/**
 * Generate Date
 *
 * Generate first day exactly a number of days ago
 *
 * @param days
 * @returns {Date}
 * @private
 */
explore._generateDate = (days) => {
    const date = moment().subtract(days, 'days');
    return date.toDate();
};

/**
 * Generate Filter Object
 *
 * Generate a object for according to week, month or all post
 *
 * @param filter
 * @returns {{filterObject: {}, order: number}}
 * @private
 */
explore._generateFilterObject = (filter) => {
    let filterObject = {};
    let order = 1;

    switch (filter) {
        case 'week': {
            filterObject = {
                createdAt: {
                    $gt: explore._generateDate(7),
                },
            };
            order = -1;
            break;
        }
        case 'month': {
            filterObject = {
                createdAt: {
                    $gt: explore._generateDate(30),
                },
            };
            order = -1;
            break;
        }
        case 'all': {
            order = -1;
            break;
        }
    }

    return {
        filterObject,
        order,
    };
};

/**
 * Explorer GET controller
 *
 * Render the explorer view with the filter
 *
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 * @returns {Promise<void>}
 */
explore.explorerGetController = async (req, res, next) => {
    const filter = req.query.filter || 'latest';
    let currentPage = parseInt(req.query.currentPage) || 1;
    let itemPerPage = 10;

    const { order, filterObject } = explore._generateFilterObject(
        filter.toLowerCase()
    );

    try {
        const posts = await Post.find(filterObject)
            .populate('author', 'username')
            .sort(order === 1 ? '-createdAt' : 'createdAt')
            .skip(itemPerPage * currentPage - itemPerPage)
            .limit(itemPerPage);

        const totalPost = await Post.countDocuments();
        const totalPages = Math.ceil(totalPost / itemPerPage);

        let bookmarks = [];
        if (req.user) {
            const profile = await Profile.findOne({ user: req.user._id });
            if (profile) {
                bookmarks = profile.bookmarks;
            }
        }

        res.render('pages/explorer/explorer.ejs', {
            title: 'Explore',
            filter,
            flashMessage: Flash.getMessage(req),
            posts,
            totalPages,
            itemPerPage,
            currentPage,
            bookmarks,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * Single post GET controller
 *
 * Render the single post view
 *
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 * @returns {Promise<void>}
 */
explore.singlePostGetController = async (req, res, next) => {
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId)
            .populate({
                path: 'author',
                select: 'username',
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'username profilePhoto',
                },
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'replies.user',
                    select: 'username profilePhoto',
                },
            });

        if (!post) {
            let error = new Error(`404 post not found`);
            error.status = 404;
            throw error;
        }

        let bookmarks = [];
        if (req.user) {
            const profile = await Profile.findOne({ user: req.user._id });
            if (profile) {
                bookmarks = profile.bookmarks;
            }
        }

        res.render('pages/dashboard/post/single-post.ejs', {
            title: post.title,
            flashMessage: Flash.getMessage(req),
            post,
            bookmarks,
        });
    } catch (e) {
        next(e);
    }
};

module.exports = explore;
