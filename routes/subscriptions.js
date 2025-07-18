const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const {
  subscribeToModel,
  getMySubscriptions,
  checkSubscription,
  getMySubscribers,
} = require('../controllers/subscribeController');

const { subscribeToPlan } = require('../controllers/subscribeToPlan');

// ✅ Сначала более специфичный путь подписки на план
router.post('/plan', auth, subscribeToPlan);

// ✅ Далее — подписка на модель
router.post('/:modelId', auth, subscribeToModel);

// ✅ Получить все подписки текущего пользователя
router.get('/', auth, getMySubscriptions);

// ✅ Проверить подписан ли на конкретную модель
router.get('/check/:modelId', auth, checkSubscription);

// ✅ Список своих подписчиков
router.get('/my-subscribers', auth, getMySubscribers);

module.exports = router;
