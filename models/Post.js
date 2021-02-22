const { Schema, model } = require('mongoose');
// const User = require('./User');
const Comment = require('./Comment');

const postSchema = new Schema(
    {
        title: {
            type: String,
            trim: true,
            maxlength: 100,
            required: true,
        },
        body: {
            type: String,
            trim: true,
            required: true,
            maxlength: 5000,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        tags: {
            type: [String],
            trim: true,
            required: true,
        },
        thumbnail: String,
        readTime: String,
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        dislikes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: Comment,
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Post = model('Post', postSchema);

module.exports = Post;
