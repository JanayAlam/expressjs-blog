const { Schema, model } = require('mongoose');
// const User = require('./User');
// const Post = require('./Post');

const profileSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        firstName: {
            type: String,
            trim: true,
            maxlength: 25,
            required: true,
        },
        lastName: {
            type: String,
            trim: true,
            maxlength: 25,
            required: true,
        },
        title: {
            type: String,
            trim: true,
            required: true,
            maxlength: 100,
        },
        bio: {
            type: String,
            trim: true,
            required: true,
            maxlength: 500,
        },
        profilePhoto: {
            type: String,
            default: '/uploads/default.png',
        },
        links: {
            website: String,
            linkedin: String,
            facebook: String,
            twitter: String,
            github: String,
        },
        posts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Post',
            },
        ],
        bookmarks: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Post',
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Profile = model('Profile', profileSchema);

module.exports = Profile;
