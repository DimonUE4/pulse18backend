// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // кому принадлежит
  text: String,
  type: { type: String, enum: ['purchase', 'subscription', 'general', 'comment', 'tip', 'like'] },
  createdAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }
});

module.exports = mongoose.model('Notification', notificationSchema);
