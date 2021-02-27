const route = require('express').Router();
const {
    searchResultGetController,
} = require('../controllers/searchController');

route.get('/', searchResultGetController);

module.exports = route;
