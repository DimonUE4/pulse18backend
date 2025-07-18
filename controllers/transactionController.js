const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { from: req.user._id },
        { to: req.user._id },
        { user: req.user._id } // 👈 добавляем, если есть поле user
      ]
    })
      .sort({ createdAt: -1 })
      .populate('from', 'username')
      .populate('to', 'username');

    const result = transactions.map(tx => {
      const isModel = tx.to && tx.to._id
        ? String(tx.to._id) === String(req.user._id)
        : false;
    
      const displayUser = tx.from || tx.to;
    
      return {
        _id: tx._id,
        type: tx.type,
        amount: tx.amount,
        createdAt: tx.createdAt,
        status: tx.status || 'completed',
        description: tx.description,
        displayUser: displayUser ? { username: displayUser.username } : null
      };
    });
    

    res.json(result);
  } catch (err) {
    console.error('Ошибка при получении транзакций', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
