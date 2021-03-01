// dependencies
const { body } = require('express-validator');
const User = require('../../models/User');

// module sraffolding
const validator = {};

validator.changePassword = [
    body('oldPassword')
        .isLength({ min: 5 })
        .withMessage('Password must be greater than 5 characters'),
    body('newPassword')
        .isLength({ min: 5 })
        .withMessage('Password must be greater than 5 characters'),
    body('confirmPassword')
        .isLength({ min: 5 })
        .withMessage('Password must be greater than 5 characters')
        .custom((confirmPassword, { req }) => {
            if (confirmPassword !== req.body.newPassword) {
                throw new Error('Password does not matched');
            }
            return true;
        }),
];

// exporting module
module.exports = validator;
