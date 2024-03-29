const Profile = require('../../models/Profile');

const bookmarks = {};

/**
 * Add bookmark of a post
 *
 * Handle the add bookmark event of the client
 *
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @returns {Object}
 */
bookmarks.addBookmark = async (req, res) => {
    const { postId } = req.params;
    let bookmarked = null;

    // checking the authentication
    if (!req.user) {
        return res.status(403).json({
            error: 'You are not an authenticated user',
        });
    }

    const userId = req.user._id;

    try {
        let profile = await Profile.findOne({ user: userId });
        if (!profile) {
            return res.status(404).json({
                error: 'Profile not found',
            });
        }
        if (profile.bookmarks.includes(postId)) {
            await Profile.findOneAndUpdate(
                { user: userId },
                { $pull: { bookmarks: postId } }
            );
            bookmarked = false;
        } else {
            await Profile.findOneAndUpdate(
                { user: userId },
                { $push: { bookmarks: postId } }
            );
            bookmarked = true;
        }

        res.status(200).json({
            bookmarked,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            error: 'There was a problem in the server side',
        });
    }
};

module.exports = bookmarks;
