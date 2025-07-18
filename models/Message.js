const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: String,
  media: [String], // массив URL'ов к файлам
  createdAt: {
    type: Date,
    default: Date.now
  },
  price: {
    type: Number,
    default: 0
  },
  isLocked: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Message', messageSchema);
