const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: 'Нет авторизации' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ message: 'Пользователь не найден' });

    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
      balance: user.balance
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Неверный токен' });
  }
};
