const moment = require('moment');

const Flash = require('../utils/Flash');
const Post = require('../models/Post');

const explore = {};

explore._genarateDate = (days) => {
    const date = moment().subtract(days, 'days');
    return date.toDate();
};

explore._genarateFilterObject = (filter) => {
    let filterObject = {};
    let order = 1;

    switch (filter) {
        case 'week': {
            filterObject = {
                createdAt: {
                    $gt: explore._genarateDate(7),
                },
            };
            order = -1;
            break;
        }
        case 'month': {
            filterObject = {
                createdAt: {
                    $gt: explore._genarateDate(30),
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

explore.explorerGetController = async (req, res, next) => {
    const filter = req.query.filter || 'latest';
    let currentPage = parseInt(req.query.currentPage) || 1;
    let itemPerPage = 10;

    const { order, filterObject } = explore._genarateFilterObject(
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

        res.render('pages/explorer/explorer.ejs', {
            title: 'Explore',
            filter,
            flashMessage: Flash.getMessage(req),
            posts,
            totalPages,
            itemPerPage,
            currentPage,
        });
    } catch (e) {
        next(e);
    }
};

module.exports = explore;
