const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Получить данные пользователя по username
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('name username avatar description role');
    if (!user || user.role !== 'model') return res.status(404).json({ message: 'Пользователь не найден' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
