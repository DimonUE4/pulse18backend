const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const controller = require('../controllers/subscriptionPlanController');

router.get('/', auth, controller.getPlans); // Все планы текущей модели
router.post('/', auth, controller.createPlan); // Создать
router.put('/:id', auth, controller.updatePlan); // Обновить
router.delete('/:id', auth, controller.deletePlan);
// Планы модели по ID — публичный доступ
router.get('/public/:modelId', controller.getPlansPublic);


module.exports = router;
