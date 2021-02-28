// models
const Profile = require('../../models/Profile');

// module scaffolding
const star = {};

/**
 * Add Star Controller
 *
 * add star or remove star
 *
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 */
star.addStar = async (req, res, next) => {
    const { profileId } = req.params;

    try {
        const profile = await Profile.findById(profileId);
        let stared = null;

        if (profile) {
            if (profile.stars.includes(req.user._id)) {
                await Profile.findOneAndUpdate(
                    { _id: profileId },
                    { $pull: { stars: req.user._id } }
                );
                stared = false;
            } else {
                await Profile.findOneAndUpdate(
                    { _id: profileId },
                    { $push: { stars: req.user._id } }
                );
                stared = true;
            }

            return res.status(200).json({
                stared,
            });
        } else {
            console.log(e);
            return res.status(404).json({
                error: 'Profile not found',
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            error: 'There was a problem in the server side',
        });
    }
};

module.exports = star;
