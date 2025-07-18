
const path = require('path');
const fs = require('fs');

const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  try {
    const { text, price } = req.body;
    const mediaFiles = req.files || [];

    const mediaPaths = mediaFiles.map(file => '/uploads/' + file.filename);

    const newPost = new Post({
      author: req.user.id, // ✅ вот это обязательно!
      text,
      price: parseFloat(price) || 0,
      media: mediaPaths
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error('Ошибка при создании поста:', err);
    res.status(500).json({ message: 'Ошибка при создании поста' });
  }
};


exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .populate('author', 'name username avatar') // 👈 обязательно!
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при загрузке постов' });
  }
};

// Получить все посты всех моделей (для публичной ленты)
exports.getPublicFeed = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name username avatar') // подтянуть инфу об авторе
      .sort({ createdAt: -1 }); // по дате, новые сверху

    res.json(posts);
  } catch (err) {
    console.error('Ошибка при загрузке публичной ленты:', err);
    res.status(500).json({ message: 'Ошибка при загрузке ленты' });
  }
};


