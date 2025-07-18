// routes/notifications.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getMyNotifications } = require('../controllers/notificationController');

router.get('/', auth, getMyNotifications);

module.exports = router;
