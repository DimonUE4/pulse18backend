const Transaction = require('../models/Transaction');
const Subscription = require('../models/Subscription');
const User = require('../models/User');


exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await Transaction.find({ to: userId, status: 'completed' });

    let total = 0, subscriptions = 0, tips = 0, content = 0;

    transactions.forEach(tx => {
      total += tx.amount;
      if (tx.type === 'subscription') subscriptions += tx.amount;
      else if (tx.type === 'tip') tips += tx.amount;
      else if (tx.type === 'post' || tx.type === 'message') content += tx.amount;
    });

    res.json({
      total,
      subscriptions,
      tips,
      content
    });
  } catch (err) {
    console.error('Ошибка статистики:', err);
    res.status(500).json({ message: 'Ошибка получения статистики' });
  }
};
exports.getAllStats = async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Получаем все подписки
      const allSubs = await Subscription.find({ model: userId });
  
      const totalSubscribers = allSubs.length;
      const newSubscribers = allSubs.filter(sub => {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return sub.startDate >= thirtyDaysAgo;
      }).length;
  
      // Доход
      const transactions = await Transaction.find({ to: userId, status: 'completed' });
  
      let totalIncome = 0;
      let subsIncome = 0;
      let tipsIncome = 0;
      let contentIncome = 0;
  
      transactions.forEach(tx => {
        totalIncome += tx.amount;
        if (tx.type === 'subscription') subsIncome += tx.amount;
        if (tx.type === 'tip') tipsIncome += tx.amount;
        if (tx.type === 'post' || tx.type === 'message') contentIncome += tx.amount;
      });
  
      // Активные фанаты
      const activeFans = await Subscription.countDocuments({ model: userId, isActive: true });
  
      const summary = {
        totalSubscribers,
        newSubscribers,
        totalIncome,
        subsIncome,
        tipsIncome,
        contentIncome,
        activeFans
      };    // 📌 Месячная статистика за последний год
      const monthlyStats = [];
      const now = new Date();
  
      for (let i = 0; i < 12; i++) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);
  
        const monthSubs = await Subscription.countDocuments({
          model: userId,
          startDate: { $gte: monthStart, $lt: nextMonth }
        });
  
        const monthTransactions = await Transaction.find({
          to: userId,
          status: 'completed',
          createdAt: { $gte: monthStart, $lt: nextMonth }
        });
  
        let income = 0, tips = 0, paidMessages = 0;
        monthTransactions.forEach(tx => {
          income += tx.amount;
          if (tx.type === 'tip') tips += tx.amount;
          if (tx.type === 'message' || tx.type === 'post') paidMessages += tx.amount;
        });
  
        monthlyStats.push({
          month: monthStart.toLocaleString('ru-RU', { month: 'long', year: 'numeric' }),
          newSubscribers: monthSubs,
          income,
          tips,
          paidMessages
        });
      }
  
      // 📌 Статистика по регионам
      const userList = await User.find({ _id: { $in: allSubs.map(sub => sub.subscriber) } });
  
      const regions = {};
      userList.forEach(user => {
        const region = user.region || 'Не указано';
        if (!regions[region]) regions[region] = { count: 0, income: 0 };
        regions[region].count += 1;
      });
  
      transactions.forEach(tx => {
        const subscriber = userList.find(user => String(user._id) === String(tx.from));
        if (subscriber) {
          const region = subscriber.region || 'Не указано';
          if (regions[region]) regions[region].income += tx.amount;
        }
      });
  
      const regionsArray = Object.entries(regions).map(([region, data]) => ({
        region,
        subscribers: data.count,
        income: data.income,
        avgIncome: data.count > 0 ? +(data.income / data.count).toFixed(2) : 0
      }));
  
      res.json({
        success: true,
        summary,
        monthlyStats,
        regionsArray
      });
  
    } catch (err) {
      console.error('Ошибка получения общей статистики:', err);
      res.status(500).json({ message: 'Ошибка получения статистики' });
    }
  };