const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getStats } = require('../controllers/statsController');
const { getAllStats } = require('../controllers/statsController');

// Получение статистики дохода
router.get('/', auth, getStats);
// Общая статистика модели
router.get('/allstats', auth, getAllStats);

module.exports = router;
