const Chat = require('../models/Chat');
const User = require('../models/User');

exports.getOrCreateChat = async (req, res) => {
  const { username } = req.params;
  const currentUserId = req.user.id;

  try {
    const otherUser = await User.findOne({ username });
    if (!otherUser) return res.status(404).json({ message: 'Пользователь не найден' });

    let chat = await Chat.findOne({
      participants: { $all: [currentUserId, otherUser._id] }
    }).populate('participants', 'username name avatar');

    if (!chat) {
      chat = await Chat.create({
        participants: [currentUserId, otherUser._id],
        messages: []
      });
      await chat.populate('participants', 'username name avatar');
    }

    res.json(chat);
  } catch (err) {
    console.error('Ошибка чата:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

exports.getMyChats = async (req, res) => {
    try {
      const chats = await Chat.find({ participants: req.user.id })
        .populate('participants', 'username name avatar')
        .populate({
          path: 'messages',
          options: { sort: { createdAt: -1 }, limit: 1 } // последнее сообщение
        });
  
      res.json(chats);
    } catch (err) {
      console.error('Ошибка при получении чатов:', err);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  };