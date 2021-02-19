// dependencies
const { body } = require('express-validator');
const User = require('../../models/User');

// module sraffolding
const validator = {};

validator.loginValidator = [
    body('email').not().isEmpty().withMessage('Email field is required'),
    body('password').not().isEmpty().withMessage('Password field is required'),
];

// exporting module
module.exports = validator;
