const express = require('express');
const router = express.Router();
const {
  purchasePost,
  purchaseMessage,
  getPurchases
} = require('../controllers/purchaseController');
const auth = require('../middleware/authMiddleware');

router.post('/post/:postId', auth, purchasePost);
router.post('/message/:messageId', auth, purchaseMessage);
router.get('/', auth, getPurchases); // ← обязательно был импорт getPurchases


module.exports = router;
