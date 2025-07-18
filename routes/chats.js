const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { initiateChat } = require('../controllers/chatController');

router.get('/initiate/:username', auth, initiateChat);

module.exports = router;
