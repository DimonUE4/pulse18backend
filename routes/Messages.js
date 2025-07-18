const express = require('express');
const router = express.Router();
const { deleteMessage } = require('../controllers/messageController');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const { getMessages, sendMessage } = require('../controllers/messageController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Папка для медиа
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Получить сообщения конкретного чата
router.get('/:chatId', auth, getMessages);

router.post(
  '/:chatId',
  auth,
  upload.fields([{ name: 'media', maxCount: 10 }]),
  (req, res, next) => {
    console.log('--- [ROUTE] ---');
    console.log('BODY:', req.body);
    console.log('FILES:', req.files);
    next(); // Передаем дальше в контроллер
  },
  sendMessage
);

router.delete('/:id', auth, deleteMessage);

module.exports = router;
