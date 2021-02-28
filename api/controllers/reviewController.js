// models
const Profile = require('../../models/Profile');
const Review = require('../../models/Review');
const User = require('../../models/User');

// module scaffolding
const review = {};

/**
 * Create a new review controller
 *
 * Create a new review into a author profile
 *
 * @param {Request} req Request object with a body {body: String}
 * @param {Response} res
 * @param {next} next
 */
review.postNewReview = async (req, res, next) => {
    const { body } = req.body;
    const reviewerUserId = req.user._id;
    const authorProfileId = req.params.profileId;

    try {
        const review = new Review({
            from: reviewerUserId,
            body,
        });

        const createdReview = await review.save();

        await Profile.findOneAndUpdate(
            { _id: authorProfileId },
            {
                $push: { reviews: createdReview._id },
            },
            { new: true }
        );

        const reviewerUser = await User.findById(createdReview.from).populate({
            path: 'profile',
            select: 'profilePhoto firstName lastName',
        });

        return res.status(201).json({
            body,
            profilePhoto: reviewerUser.profile.profilePhoto,
            fullName:
                reviewerUser.profile.firstName +
                ' ' +
                reviewerUser.profile.lastName,
            createdAt: review.createdAt,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            error: 'There was a problem in the server side',
        });
    }
};

module.exports = review;
