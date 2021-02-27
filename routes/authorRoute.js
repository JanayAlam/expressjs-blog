// dependencies
const router = require('express').Router();

const {
    getAuthorProfileController,
} = require('../controllers/authorController');

router.get('/:profileId', getAuthorProfileController);

// exporting module
module.exports = router;
