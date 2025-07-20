const User = require('../models/User');
const Notification = require('../models/Notification');
const Transaction = require('../models/Transaction');

exports.sendTip = async (req, res) => {
  try {
    const { receiver, amount, text } = req.body;
    const sender = await User.findById(req.user.id);
    const recipient = await User.findById(receiver);

    if (!recipient) return res.status(404).json({ message: 'Получатель не найден' });
    if (sender.balance < amount) return res.status(400).json({ message: 'Недостаточно средств' });

    const commission = +(amount * 0.1).toFixed(2);
    const payout = +(amount - commission).toFixed(2);

    const admin = await User.findOne({ isAdmin: true });

    sender.balance -= amount;
    recipient.balance += payout;
    if (admin) admin.balance += commission;

    await Promise.all([
      sender.save(),
      recipient.save(),
      admin?.save(),
      Transaction.create({
        from: sender._id,
        to: recipient._id,
        type: 'tip',
        amount: payout,
        commission,
        description: text || `Чаевые от ${sender.username}`
      }),
      Notification.create({
        user: recipient._id,
        text: `@${sender.username} отправил вам чаевые: ₽${amount}`,
        type: 'tip'
      })
    ]);

    res.json({ success: true });
  } catch (err) {
    console.error('Ошибка отправки чаевых:', err);
    
  }
};
