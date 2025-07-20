const User = require('../models/User');
const Post = require('../models/Post');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const Transaction = require('../models/Transaction');

exports.getPurchases = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      purchasedPosts: user.purchasedPosts || [],
      purchasedMessages: user.purchasedMessages || [],
      gallery: user.gallery || []
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка получения покупок' });
  }
};

exports.purchasePost = async (req, res) => {
  try {
    const buyer = await User.findById(req.user.id);
    const post = await Post.findById(req.params.postId).populate('author');
    if (!post || !post.price) return res.status(404).json({ message: 'Пост не найден' });

    if (buyer.purchasedPosts.includes(post._id)) return res.json({ message: 'Уже куплено' });

    if (buyer.balance < post.price) return res.status(400).json({ message: 'Недостаточно средств' });

    const creator = await User.findById(post.author._id);
    const commission = +(post.price * 0.1).toFixed(2);
    const payout = +(post.price - commission).toFixed(2);
    const admin = await User.findOne({ isAdmin: true });

    buyer.balance -= post.price;
    buyer.purchasedPosts.push(post._id);
    if (post.media?.length) {
      post.media.forEach(url => {
        if (!buyer.gallery.includes(url)) buyer.gallery.push(url);
      });
    }

    creator.balance += payout;
    if (admin) admin.balance += commission;

    await Promise.all([
      buyer.save(),
      creator.save(),
      admin?.save(),
      Transaction.create({
        from: buyer._id,
        to: creator._id,
        type: 'post',
        amount: payout,
        commission,
        relatedId: post._id,
        description: `Продажа поста #${post._id}`
      }),
      Notification.create({
        user: creator._id,
        text: `@${buyer.username} купил ваш пост за ${post.price}₽`,
        type: 'purchase'
      })
    ]);

    res.json({ success: true, newBalance: buyer.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при покупке поста' });
  }
};

exports.purchaseMessage = async (req, res) => {
  try {
    const buyer = await User.findById(req.user.id);
    const message = await Message.findById(req.params.messageId).populate('sender');
    if (!message || !message.price) return res.status(404).json({ message: 'Сообщение не найдено' });

    if (buyer.purchasedMessages.includes(message._id)) return res.json({ message: 'Уже куплено' });

    if (buyer.balance < message.price) return res.status(400).json({ message: 'Недостаточно средств' });

    const creator = await User.findById(message.sender._id || message.sender);
    const commission = +(message.price * 0.1).toFixed(2);
    const payout = +(message.price - commission).toFixed(2);
    const admin = await User.findOne({ isAdmin: true });

    buyer.balance -= message.price;
    buyer.purchasedMessages.push(message._id);
    if (message.media?.length) {
      message.media.forEach(url => {
        if (!buyer.gallery.includes(url)) buyer.gallery.push(url);
      });
    }

    creator.balance += payout;
    if (admin) admin.balance += commission;

    await Promise.all([
      buyer.save(),
      creator.save(),
      admin?.save(),
      Transaction.create({
        from: buyer._id,
        to: creator._id,
        type: 'message',
        amount: payout,
        commission,
        relatedId: message._id,
        description: `Продажа сообщения #${message._id}`
      }),
      Notification.create({
        user: creator._id,
        text: `@${buyer.username} купил ваше сообщение за ${message.price}₽`,
        type: 'purchase'
      })
    ]);
    

    res.json({ success: true, newBalance: buyer.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при покупке сообщения' });
  }
};

