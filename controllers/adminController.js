// controllers/adminController.js
const User = require('../models/User');
const Transaction = require('../models/Transaction');

exports.getAdminDashboard = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Нет доступа' });

    const users = await User.find({}, 'username email role balance isAdmin');

    const platformIncome = await Transaction.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalCommission: { $sum: '$commission' }
        }
      }
    ]);

    res.json({
      adminBalance: req.user.balance,
      users,
      platformIncome: platformIncome[0]?.totalCommission || 0
    });
  } catch (err) {
    console.error('Ошибка в админ-панели:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
