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
                select: 'title body tags thumbnail',
            })
            .populate({
                path: 'user',
                select: 'username email',
            });

        const isSameUser =
            JSON.stringify(profile.user._id) == JSON.stringify(req.user._id);

        res.render('pages/explorer/author-page.ejs', {
            title: profile.user.username,
            profile,
            isSameUser,
            flashMessage: Flash.getMessage(req),
        });
    } catch (e) {
        next(e);
    }
};

module.exports = author;
