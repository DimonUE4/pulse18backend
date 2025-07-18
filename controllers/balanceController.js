// controllers/balanceController.js
const User = require('../models/User');

exports.getBalance = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ balance: user.balance || 0 });
};

exports.topUpBalance = async (req, res) => {
  const { amount, method } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Неверная сумма' });
  }

  const user = await User.findById(req.user.id);
  user.balance = (user.balance || 0) + Number(amount);
  await user.save();

  res.json({ success: true, balance: user.balance });
};

exports.withdrawBalance = async (req, res) => {
  const { amount, method } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Неверная сумма для вывода' });
  }

  const user = await User.findById(req.user.id);

  if ((user.balance || 0) < amount) {
    return res.status(400).json({ message: 'Недостаточно средств на балансе' });
  }

  user.balance -= Number(amount);
  await user.save();

  res.json({ success: true, balance: user.balance, message: 'Запрос на вывод принят' });
};
