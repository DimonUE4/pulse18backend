const express = require('express');
const router = express.Router();

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Вы вышли из системы' });
});

module.exports = router;