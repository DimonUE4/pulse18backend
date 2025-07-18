const Chat = require('../models/Chat');
const User = require('../models/User');

exports.initiateChat = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetUsername = req.params.username;

    const targetUser = await User.findOne({ username: targetUsername });
    if (!targetUser) return res.status(404).json({ message: 'Пользователь не найден' });

    const existingChat = await Chat.findOne({
      members: { $all: [currentUserId, targetUser._id] },
      isGroup: false
    });

    if (existingChat) {
      return res.json({ chatId: existingChat._id });
    }

    const newChat = await Chat.create({
      members: [currentUserId, targetUser._id],
      isGroup: false
    });

    res.status(201).json({ chatId: newChat._id });
  } catch (err) {
    console.error('Ошибка создания чата:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
