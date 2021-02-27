// utils
const Flash = require('../utils/Flash');

// models
const Profile = require('../models/Profile');

// module scaffolding
const author = {};

author.getAuthorProfileController = async (req, res, next) => {
    const { profileId } = req.params;

    try {
        const profile = await Profile.findById(profileId)
            .populate({
                path: 'posts',
                select: 'title body tags',
            })
            .populate({
                path: 'user',
                select: 'username email',
            });
        res.render('pages/explorer/author-page.ejs', {
            title: profile.username,
            profile,
            flashMessage: Flash.getMessage(req),
        });
    } catch (e) {
        next(e);
    }
};

module.exports = author;
