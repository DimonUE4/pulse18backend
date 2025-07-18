const multer = require('multer');
const path = require('path');
const fs = require('fs');
const price = req.body.price || 0;
const isLocked = parseFloat(price) > 0;

// Настройка Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/messages');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  }
});

const upload = multer({ storage });
exports.upload = upload.array('media', 5); // максимум 5 файлов

// ✅ sendMessage обновлённый
exports.sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { chatId } = req.params;
    const files = req.files || [];

    const mediaUrls = files.map(file => `/uploads/messages/${file.filename}`);

    const message = await Message.create({
      chat: chatId,
      sender: req.user.id,
      text,
      media: mediaUrls,
      price,
      isLocked
    });

    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: message._id }
    });

    const populated = await message.populate('sender', 'username name avatar');
    res.status(201).json(populated);
  } catch (err) {
    console.error('Ошибка при отправке сообщения:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
