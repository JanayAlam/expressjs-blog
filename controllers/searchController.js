// utils
const Flash = require('../utils/Flash');

// models
const Post = require('../models/Post');

// module scaffolding
const search = {};

/**
 * Search GET Controller
 *
 * Render search result view
 *
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 */
search.searchResultGetController = async (req, res, next) => {
    const term = req.query.term;
    const currentPage = parseInt(req.query.page || 1);
    const itemPerPage = 10;

    try {
        const posts = await Post.find({
            $text: { $search: term },
        })
            .skip(itemPerPage * currentPage - itemPerPage)
            .limit(itemPerPage);

        const totalPost = await Post.countDocuments({
            $text: { $search: term },
        });

        const totalPages = totalPost / itemPerPage;
        res.render('pages/explorer/search.ejs', {
            title: `Result for - ${term}`,
            flashMessage: Flash.getMessage(req),
            searchTerm: term,
            itemPerPage,
            currentPage,
            totalPages,
            posts,
        });
    } catch (e) {
        next(e);
    }
};

module.exports = search;
