const express = require('express');
const router = express.Router();
const { getBalance, topUpBalance } = require('../controllers/balanceController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, getBalance);
router.post('/topup', auth, topUpBalance); // пока это просто заглушка

module.exports = router;
