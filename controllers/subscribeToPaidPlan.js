const Subscription = require('../models/Subscription');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

exports.subscribeToPaid = async (req, res) => {
  try {
    const userId = req.user.id;
    const { modelId, price } = req.body;

    if (!modelId || !price) return res.status(400).json({ message: 'Некорректные данные подписки' });

    const user = await User.findById(userId);
    if (user.balance < price) return res.status(400).json({ message: 'Недостаточно средств на балансе' });

    const model = await User.findById(modelId);
    if (!model) return res.status(404).json({ message: 'Модель не найдена' });

    // Проверка активной подписки
    const existing = await Subscription.findOne({ subscriber: userId, model: modelId });
    if (existing) return res.status(400).json({ message: 'Вы уже подписаны' });

    // Списание баланса
    user.balance -= price;
    await user.save();

    // Зачисление модели с учётом комиссии
    const earnings = +(price * 0.9).toFixed(2);
    model.balance += earnings;
    await model.save();

    const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Создание подписки
    const subscription = await Subscription.create({
      subscriber: userId,
      model: modelId,
      startDate: new Date(),
      endDate,
      isActive: true,
      autoRenew: true,
      price
    });

    // Транзакция
    await Transaction.create({
      from: userId,
      to: modelId,
      type: 'subscription',
      amount: earnings,
      description: 'Платная подписка',
      commission: +(price * 0.1).toFixed(2)
    });

    res.json({ success: true, message: 'Вы успешно подписались', subscription });

  } catch (err) {
    console.error('Ошибка подписки:', err);
    res.status(500).json({ message: 'Ошибка оформления подписки' });
  }
};
