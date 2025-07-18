const Message = require('../models/Message'); // <-- это важно!

const Chat = require('../models/Chat');

// ✅ Получить все сообщения конкретного чата
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .sort({ createdAt: 1 })
      .populate('sender', 'username name avatar');

    res.json(messages);
  } catch (err) {
    console.error('Ошибка при получении сообщений:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// ✅ Отправить новое сообщение в чат
exports.sendMessage = async (req, res) => {
  try {
    console.log('--- [CONTROLLER] ---');
    console.log('BODY:', req.body);
    console.log('FILES:', req.files?.media?.map(f => f.filename));

    const { text } = req.body;
    const { chatId } = req.params;
    const files = req.files?.media || [];

    // Отдельно проверим price
    let priceRaw = req.body.price;
    console.log('RAW PRICE:', priceRaw, 'TYPE:', typeof priceRaw);

    let price;
    if (priceRaw !== undefined && priceRaw !== null && priceRaw !== '') {
      price = parseFloat(priceRaw);
    } else {
      price = 0;
    }

    const isLocked = price > 0;
    const mediaUrls = files.map(file => `/uploads/${file.filename}`);

    console.log('Parsed price:', price, 'Locked:', isLocked);
    console.log('MEDIA URLs:', mediaUrls);

    const message = await Message.create({
      chat: chatId,
      sender: req.user.id,
      text,
      media: mediaUrls,
      price,
      isLocked
    });

    console.log('✅ Message created:', message);

    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: message._id }
    });

    const populated = await message.populate('sender', 'username name avatar');
    res.status(201).json(populated);
  } catch (err) {
    console.error('❌ Ошибка при отправке сообщения:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const msg = await Message.findById(id);
    if (!msg) return res.status(404).json({ message: 'Сообщение не найдено' });

    // Только отправитель может удалить сообщение
    if (msg.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Нет прав на удаление' });
    }

    await msg.deleteOne();
    res.json({ success: true, message: 'Удалено' });
  } catch (err) {
    console.error('Ошибка при удалении сообщения:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
