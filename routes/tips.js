const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { sendTip } = require('../controllers/tipsController');


router.post('/send', auth, sendTip);

module.exports = router;
