

const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Notification = require('../models/notification');

exports.subscribeToModel = async (req, res) => {
  const modelId = req.params.modelId;
  const userId = req.user.id;

  try {
    const model = await User.findById(modelId);
    if (!model || model.role !== 'model') {
      return res.status(404).json({ message: 'Модель не найдена' });
    }

    const existing = await Subscription.findOne({ subscriber: userId, model: modelId });
    if (existing) {
      return res.status(400).json({ message: 'Вы уже подписаны на эту модель' });
    }

    const subscription = new Subscription({
      subscriber: userId,
      model: modelId,
      price: 100 // 💡 фиксированная цена
    });

    // Добавляем фаната в подписчики модели
    if (!model.subscribers.includes(userId)) {
      model.subscribers.push(userId);
      await model.save();
    }

    await subscription.save();

    // ✅ Создаём уведомление для модели
    const subscriberUser = await User.findById(userId);

    await Notification.create({
      user: model._id,
      text: `@${subscriberUser.username} подписался на вас`,
      type: 'subscription'
    });
    

    res.status(201).json({
      message: 'Подписка оформлена',
      subscription
    });
  } catch (err) {
    console.error('Ошибка при подписке:', err);
    res.status(500).json({ message: 'Ошибка при оформлении подписки' });
  }
};



// ✅ Получение всех подписок пользователя
exports.getMySubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ subscriber: req.user.id })
      .populate('model', 'name username avatar');

    res.json({ subscriptions });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении подписок' });
  }
};

// ✅ Проверка подписки с делением free / paid + activePlanId
exports.checkSubscription = async (req, res) => {
  try {
    const { modelId } = req.params;
    const userId = req.user.id;

    const allSubs = await Subscription.find({
      subscriber: userId,
      model: modelId,
      isActive: true
    });

    const free = allSubs.some(sub => sub.price === 0);
    const paidSub = allSubs.find(sub => sub.price > 0);

    res.json({
      subscribed: Boolean(free || paidSub),
      free,
      paid: Boolean(paidSub),
      activePlanId: paidSub?.planId || null
    });
  } catch (err) {
    console.error('Ошибка проверки подписки:', err);
    res.status(500).json({ message: 'Ошибка при проверке подписки' });
  }
};



exports.getMySubscribers = async (req, res) => {
  try {
    const model = await User.findById(req.user.id).populate({
      path: 'subscribers',
      select: 'username name avatar createdAt lastActive'
    });

    if (!model || model.role !== 'model') {
      return res.status(403).json({ message: 'Нет доступа' });
    }

    res.json({ subscribers: model.subscribers || [] });
  } catch (err) {
    console.error('Ошибка при получении подписчиков модели:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
