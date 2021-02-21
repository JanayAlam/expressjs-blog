// dependencies
const { body } = require('express-validator');
const validator = require('validator');

// module sraffolding
const validatorObj = {};

validatorObj.profileValidator = [
    body('firstName')
        .isLength({ max: 25 })
        .withMessage('First name must be between 2 to 25 characters')
        .trim()
        .not()
        .isEmpty()
        .withMessage('First name must not be empty'),
    body('lastName')
        .isLength({ max: 25 })
        .withMessage('Last name must be between 2 to 25 characters')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Last name must not be empty'),
    body('title')
        .isString()
        .isLength({ max: 100 })
        .withMessage('Title must not be greater than 100 charachters')
        .not()
        .isEmpty()
        .withMessage('Title must not be empty')
        .trim(),
    body('bio')
        .isString()
        .isLength({ max: 500 })
        .withMessage('Bio must not be greater than 500 charachters')
        .not()
        .isEmpty()
        .withMessage('Bio must not be empty')
        .trim(),
    body('website').custom(urlValidator),
    body('linkedin').custom(urlValidator),
    body('facebook').custom(urlValidator),
    body('twitter').custom(urlValidator),
    body('github').custom(urlValidator),
];

/**
 * Validate the url
 * If url is provided then it will check if the url is well formated
 *
 * @param {URL} value
 */
function urlValidator(value) {
    if (value) {
        if (!validator.isURL(value)) {
            throw new Error('Please provide a valid url');
        }
    }
    return true;
}

// exporting module
module.exports = validatorObj;
