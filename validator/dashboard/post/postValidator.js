// dependencies
const { body } = require('express-validator');
const cheerio = require('cheerio');

// module sraffolding
const validator = {};

validator.postValidator = [
    body('title')
        .not()
        .isEmpty()
        .withMessage('Title cannot be empty')
        .isLength({ max: 100 })
        .withMessage('Title cannot be greater than 100 characters'),
    body('body')
        .not()
        .isEmpty()
        .withMessage('Body of the content cannot be empty')
        .custom((value) => {
            let $ = cheerio.load(value);
            let text = $.text();

            if (text.length > 5000) {
                throw new Error(
                    'Content body cannot be greater than 5000 characters'
                );
            }
            return true;
        }),
    body('tags')
        .not()
        .isEmpty()
        .withMessage('Atleast 1 tag is required')
        .custom((value) => {
            const arr = value.split(',');
            if (arr.length > 10) {
                throw new Error('You cannot add more than 10 tags');
            }
            return true;
        }),
];

// exporting module
module.exports = validator;
