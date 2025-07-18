const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getOrCreateChat, getMyChats } = require('../controllers/chatController');

router.get('/with/:username', auth, getOrCreateChat);
router.get('/', auth, getMyChats); // ← новый

module.exports = router;
