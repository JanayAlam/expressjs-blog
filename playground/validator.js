const router = require('express').Router();
const { check, validationResult } = require('express-validator');

router.get('/validator', (req, res, next) => {
    return res.render('playground/signup.ejs', {
        title: 'Validator Playground',
    });
});

router.post(
    '/validator',
    [
        check('username')
            .not()
            .isString()
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

        const formatter = (error) => error.msg;
        console.log(errors.formatWith(formatter).mapped());

        return res.render('playground/signup.ejs', {
            title: 'Validator Playground',
        });
    }
);

module.exports = router;
