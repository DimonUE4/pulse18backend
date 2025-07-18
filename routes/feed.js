const express = require('express');
const router = express.Router();
const { getPublicFeed } = require('../controllers/postsController');

router.get('/', getPublicFeed);

module.exports = router;
