const User = require('../models/User');

// Получение текущего профиля
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка получения профиля' });
  }
};

// Обновление профиля
exports.updateProfile = async (req, res) => {
    try {
      const { name, username, description, social } = req.body;
  
      const updated = await User.findByIdAndUpdate(
        req.user.id,
        { $set: { name, username, description, social } },
        { new: true } // ✅ Вернуть обновлённый документ
      ).select('-password');
  
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: 'Ошибка при обновлении' });
    }
  };
  