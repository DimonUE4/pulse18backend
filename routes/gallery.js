const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getUserGallery } = require('../controllers/galleryController');

router.get('/gallery', auth, getUserGallery);


module.exports = router;
