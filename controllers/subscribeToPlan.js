const Subscription = require('../models/Subscription');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

exports.subscribeToPlan = async (req, res) => {
  const userId = req.user.id;
  const { planId } = req.body;

  const plan = await SubscriptionPlan.findById(planId).populate('model');
  if (!plan) return res.status(404).json({ message: 'План не найден' });

  const user = await User.findById(userId);
  if (user.balance < plan.price) return res.status(400).json({ message: 'Недостаточно средств' });

  const model = await User.findById(plan.model._id);
  if (!model) return res.status(404).json({ message: 'Модель не найдена' });

  const existing = await Subscription.findOne({ subscriber: userId, model: model._id });
  if (existing) return res.status(400).json({ message: 'Вы уже подписаны' });

  // Списание
  user.balance -= plan.price;
  await user.save();

  // Перевод модели с комиссией
  const earnings = +(plan.price * 0.9).toFixed(2);
  model.balance += earnings;
  await model.save();

  const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  // Создание подписки с autoRenew
  const subscription = await Subscription.create({
    subscriber: userId,
    model: model._id,
    startDate: new Date(),
    endDate,
    isActive: true,
    autoRenew: true,
    price: plan.price
  });

  // Транзакция
  await Transaction.create({
    from: userId,
    to: model._id,
    type: 'subscription',
    amount: earnings,
    description: `Оформлена подписка ${plan.name}`,
    commission: +(plan.price * 0.1).toFixed(2)
  });

  res.json({ success: true, subscription, message: 'Подписка успешно оформлена и активирована' });
};
