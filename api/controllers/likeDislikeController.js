const Post = require('../../models/Post');

const likeDislike = {};

/**
 * Get Likes of a post
 *
 * Handle the like event of the client
 *
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @returns {Object} {liked: Boolean, totalLikes: Number, totalDislikes: Number}
 */
likeDislike.getLikes = async (req, res) => {
    const { postId } = req.params;
    let liked = null;

    // checking the authentication
    if (!req.user) {
        return res.status(403).json({
            error: 'You are not an authenticated user',
        });
    }
    const userId = req.user._id;

    try {
        const post = await Post.findById(postId);

        // previously disliked the post
        if (post.dislikes.includes(userId)) {
            await Post.findOneAndUpdate(
                { _id: postId },
                { $pull: { dislikes: userId } }
            );
        }

        // previously liked the post
        if (post.likes.includes(userId)) {
            // mark this as unlike
            await Post.findOneAndUpdate(
                { _id: postId },
                { $pull: { likes: userId } }
            );
            liked = false;
        } else {
            // first time liking
            await Post.findOneAndUpdate(
                { _id: postId },
                { $push: { likes: userId } }
            );
            liked = true;
        }

        let updatedPost = await Post.findById(postId);
        res.status(200).json({
            liked,
            totalLikes: updatedPost.likes.length,
            totalDislikes: updatedPost.dislikes.length,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            error: 'There was a problem in the server side',
        });
    }
};

/**
 * Get Dislikes of a post
 *
 * Handle the dislike event of the client
 *
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @returns {Object} {liked: Boolean, totalLikes: Number, totalDislikes: Number}
 */
likeDislike.getDislikes = async (req, res) => {
    const { postId } = req.params;
    let disliked = null;

    // checking the authentication
    if (!req.user) {
        return res.status(403).json({
            error: 'You are not an authenticated user',
        });
    }

    const userId = req.user._id;

    try {
        const post = await Post.findById(postId);

        // previously liked the post
        if (post.likes.includes(userId)) {
            // mark this as unlike
            await Post.findOneAndUpdate(
                { _id: postId },
                { $pull: { likes: userId } }
            );
        }

        // previously disliked the post
        if (post.dislikes.includes(userId)) {
            await Post.findOneAndUpdate(
                { _id: postId },
                { $pull: { dislikes: userId } }
            );
            disliked = false;
        } else {
            // first time disliking
            await Post.findOneAndUpdate(
                { _id: postId },
                { $push: { dislikes: userId } }
            );
            disliked = true;
        }

        let updatedPost = await Post.findById(postId);
        res.status(200).json({
            disliked,
            totalLikes: updatedPost.likes.length,
            totalDislikes: updatedPost.dislikes.length,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            error: 'There was a problem in the server side',
        });
    }
};

module.exports = likeDislike;
