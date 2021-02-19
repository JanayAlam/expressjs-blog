const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const Flash = require('../utils/Flash');

router.get('/validator', (req, res, next) => {
    console.log(Flash.getMessage(req));
    return res.render('playground/signup.ejs', {
        title: 'Validator Playground',
    });
});

router.post(
    '/validator',
    [
        check('username')
            .isString()
            .not()
            .isEmpty()
            .withMessage('Username is required')
            .isLength({ max: 15 })
            .withMessage(`Username cannot be greater then 15 character`)
            .trim(),
        check('email')
            .isEmail()
            .withMessage('Please provide a valid email')
            .normalizeEmail(),
        check('password').custom((value) => {
            if (value.length < 5) {
                throw new Error('Password must be greater than 5 characters');
            }
            return true;
        }),
        check('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password does not not matched');
            }
            return true;
        }),
    ],
    (req, res, next) => {
        const errors = validationResult(req);

        console.log(errors.mapped());

        // flash message
        if (!errors.isEmpty()) {
            req.flash('fail', 'There is some error');
        } else {
            req.flash('success', 'There is no error');
        }

        return res.redirect('/playground/validator');
    }
);

module.exports = router;
