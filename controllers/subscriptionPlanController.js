const SubscriptionPlan = require('../models/SubscriptionPlan');

// Получить все планы текущей модели
exports.getPlans = async (req, res) => {
  const plans = await SubscriptionPlan.find({ model: req.user.id });
  res.json(plans);
};

// Создать новый план
exports.createPlan = async (req, res) => {
  const { name, description, price } = req.body;
  const plan = await SubscriptionPlan.create({
    model: req.user.id,
    name,
    description,
    price
  });
  res.status(201).json(plan);
};

// Обновить план
exports.updatePlan = async (req, res) => {
  const plan = await SubscriptionPlan.findOneAndUpdate(
    { _id: req.params.id, model: req.user.id },
    req.body,
    { new: true }
  );
  if (!plan) return res.status(404).json({ message: 'План не найден' });
  res.json(plan);
};

// Удалить план
exports.deletePlan = async (req, res) => {
  const deleted = await SubscriptionPlan.findOneAndDelete({ _id: req.params.id, model: req.user.id });
  if (!deleted) return res.status(404).json({ message: 'План не найден' });
  res.json({ success: true });
};
// Публичный доступ к уровням подписки модели
exports.getPlansPublic = async (req, res) => {
    try {
      const plans = await SubscriptionPlan.find({ model: req.params.modelId });
      res.json(plans);
    } catch (err) {
      res.status(500).json({ message: 'Ошибка загрузки планов' });
    }
  };