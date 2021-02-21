// models
const User = require('../models/User');
const Profile = require('../models/Profile');

// utils
const Flash = require('../utils/Flash');

// module sraffolding
const upload = {};

upload.uploadProfilePhoto = async (req, res, next) => {
    if (!req.file) {
        return res.status(500).json({
            profilePhoto: req.user.profilePhoto,
        });
    }

    try {
        const profile = await Profile.findOne({ user: req.user._id });
        const profilePhoto = `/uploads/${req.file.filename}`;
        if (profile) {
            await Profile.findOneAndUpdate(
                {
                    user: req.user._id,
                },
                {
                    $set: {
                        profilePhoto,
                    },
                }
            );
        }

        await User.findOneAndUpdate(
            {
                _id: req.user._id,
            },
            {
                $set: {
                    profilePhoto,
                },
            }
        );
        res.status(200).json({
            profilePhoto,
        });
    } catch (e) {
        res.status(500).json({
            profilePhoto: req.user.profilePhoto,
        });
    }
};

module.exports = upload;
