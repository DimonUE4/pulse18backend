const Subscription = require('../models/Subscription');
const User = require('../models/User');
const Transaction = require('../models/Transaction');


async function renewSubscriptions() {
  const now = new Date();
  const expiringSubs = await Subscription.find({
    endDate: { $lte: now },
    isActive: true,
    autoRenew: true
  });

  console.log(`▶️ Найдено ${expiringSubs.length} подписок на продление`);

  for (const sub of expiringSubs) {
    const user = await User.findById(sub.subscriber);
    const model = await User.findById(sub.model);

    if (!user || !model) continue;

    if (user.balance < sub.price) {
      console.log(`❌ Недостаточно баланса у ${user.username}, подписка отключена`);
      sub.isActive = false;
      await sub.save();
      continue;
    }

    // Списание баланса
    user.balance -= sub.price;
    await user.save();

    const earnings = +(sub.price * 0.9).toFixed(2);
    model.balance += earnings;
    await model.save();

    // Продление подписки
    sub.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await sub.save();

    await Transaction.create({
      from: user._id,
      to: model._id,
      type: 'subscription',
      amount: earnings,
      description: 'Автопродление подписки',
      commission: +(sub.price * 0.1).toFixed(2)
    });

    console.log(`✅ Продлена подписка ${user.username} -> ${model.username}`);
  }
}
module.exports = renewSubscriptions;
