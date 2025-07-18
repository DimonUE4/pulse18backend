const User = require('../models/User');

exports.getUserGallery = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.gallery || []);
  } catch (err) {
    console.error('Ошибка при получении галереи:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
