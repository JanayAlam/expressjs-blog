// utils
const Flash = require('../utils/Flash');

// models
const Profile = require('../models/Profile');
const User = require('../models/User');
const review = require('../api/controllers/reviewController');

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
            })
            .populate({
                path: 'reviews',
                select: 'body from',
            })
            .populate({
                path: 'from',
                select: 'username profilePhoto',
            });

        let reviews = [];

        if (profile) {
            for (r of profile.reviews) {
                let user = await User.findById(r.from).populate({
                    path: 'profile',
                    select: 'firstName lastName',
                });
                reviews.push({
                    from: user,
                    body: r.body,
                    fullName:
                        user.profile.firstName + ' ' + user.profile.lastName,
                    createdAt: r.createdAt,
                });
            }

            if (req.user) {
                const isSameUser =
                    JSON.stringify(profile.user._id) ===
                    JSON.stringify(req.user._id);

                res.render('pages/explorer/author-page.ejs', {
                    title: profile.user.username,
                    profile,
                    isSameUser,
                    reviews,
                    flashMessage: Flash.getMessage(req),
                });
            } else {
                return res.redirect('/auth/login');
            }
        } else {
            let error = new Error('Profile not found');
            error.status = 404;
            throw error;
        }
    } catch (e) {
        next(e);
    }
};

module.exports = author;
