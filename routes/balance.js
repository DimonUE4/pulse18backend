// routes/balance.js
const express = require('express');
const router = express.Router();
const { getBalance, topUpBalance, withdrawBalance } = require('../controllers/balanceController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, getBalance);
router.post('/topup', auth, topUpBalance);
router.post('/withdraw', auth, withdrawBalance); // ← новая строка

module.exports = router;
