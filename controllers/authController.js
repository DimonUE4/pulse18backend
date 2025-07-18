const User = require('../models/User');
const jwt = require('jsonwebtoken');

const createToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email уже используется' });

    const user = await User.create({ email, password, role });

    const token = createToken(user);
    res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });
    res.status(201).json({ user: { id: user._id, email: user.email, role: user.role } });
  } catch {
    res.status(500).json({ message: 'Ошибка регистрации' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Неверные данные' });

    // ✅ Установка isAdmin если admin логинится
    if (email === 'admin@gmail.com' && password === 'admin42@' && !user.isAdmin) {
      user.isAdmin = true;
      await user.save();
    }

    const token = createToken(user);
    res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });

    // ✅ Перенаправление клиента
    res.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin
      }
    });
  } catch {
    res.status(500).json({ message: 'Ошибка входа' });
  }
};

