const fs = require('fs');
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

    const oldProfilePhoto = req.user.profilePhoto;

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

        if (oldProfilePhoto !== '/uploads/default.png') {
            fs.unlink(`public${oldProfilePhoto}`, (error) => {
                if (error) console.log(error);
            });
        }

        res.status(200).json({
            profilePhoto,
        });
    } catch (e) {
        res.status(500).json({
            profilePhoto: req.user.profilePhoto,
        });
    }
};

upload.removeProfilePhoto = (req, res, next) => {
    const defaultProfile = '/uploads/default.png';
    try {
        const currentProfilePhoto = req.user.profilePhoto;

        fs.unlink(`public${currentProfilePhoto}`, async (error) => {
            const profile = await Profile.findOne({ user: req.user._id });
            if (profile) {
                await Profile.findOneAndUpdate(
                    {
                        user: req.user._id,
                    },
                    {
                        $set: {
                            profilePhoto: defaultProfile,
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
                        profilePhoto: defaultProfile,
                    },
                }
            );
        });
        res.status(200).json({
            profilePhoto: defaultProfile,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            error: 'Cannot remove profile photo',
        });
    }
};

module.exports = upload;
