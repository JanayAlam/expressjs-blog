// model
const Comment = require('../../models/Comment');
const Post = require('../../models/Post');
const comment = {};

/**
 * Create comment controller
 *
 * Create comment into a post with the help of post id from the request params
 *
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @returns {Object} json object
 */
comment.createCommentController = async (req, res) => {
    const { postId } = req.params;
    const { body } = req.body;

    // checking the authentication
    if (!req.user) {
        return res.status(403).json({
            error: 'You are not an authenticated user',
        });
    }

    // create a object of comment
    const comment = new Comment({
        post: postId,
        user: req.user._id,
        body,
        replies: [],
    });

    try {
        const createdComment = await comment.save();
        // updating the post
        await Post.findOneAndUpdate(
            { _id: postId },
            { $push: { comments: createdComment._id } }
        );
        // getting the user from comment user ref
        const commentJSON = await (
            await Comment.findById(createdComment._id)
        ).populate({
            path: 'user',
            select: 'profilePhoto username',
        });

        return res.status(201).json({
            commentJSON,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            error: 'There was a problem in the server side',
        });
    }
};

/**
 * Create reply controller
 * Create reply of a comment with the help of comment id from the request params
 *
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @returns {Object} json object
 */
comment.createReplyController = async (req, res) => {
    const { commentId } = req.params;
    const { body } = req.body;

    // checking the authentication
    if (!req.user) {
        return res.status(403).json({
            error: 'You are not an authenticated user',
        });
    }

    let reply = {
        body,
        user: req.user._id,
        createdAt: Date.now(),
    };

    try {
        // pushing the id in the comment model
        await Comment.findOneAndUpdate(
            {
                _id: commentId,
            },
            {
                $push: { replies: reply },
            }
        );
        res.status(201).json({
            ...reply,
            profilePhoto: req.user.profilePhoto,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            error: 'There was a problem in the server side',
        });
    }
};

module.exports = comment;
