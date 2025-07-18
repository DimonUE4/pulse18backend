const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const { createPost, getMyPosts } = require('../controllers/postsController');

// хранилище для файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
  }
});
const upload = multer({ storage });

router.post('/', auth, upload.array('media', 5), createPost);
router.get('/', auth, getMyPosts);

module.exports = router;

const Post = require('../models/Post');
const User = require('../models/User');

// Получить посты по username
router.get('/by/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка загрузки постов' });
  }
});

module.exports = router;
