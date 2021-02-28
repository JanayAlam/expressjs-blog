const Profile = require('../../models/Profile');

const review = {};

review.postNewReview = async (req, res, next) => {
    const { body } = req.body;
    const reviewerUserId = req.user._id;
    const authorProfileId = req.params.profileId;

    try {
        const profile = await Profile.findOneAndUpdate(
            { _id: authorProfileId },
            {
                $push: { reviews: { body, reviewerUserId } },
            }
        );

        return res.status(201).json({
            body,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            error: 'There was a problem in the server side',
        });
    }
};

module.exports = review;
