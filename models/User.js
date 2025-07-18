const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'model'], default: 'user' },
  balance: {
    type: Number,
    default: 0
  },

  // 👇 добавляем недостающие поля профиля
  name: { type: String, default: '' },
  username: { type: String, default: '' },
  description: { type: String, default: '' },
  isAdmin: { type: Boolean, default: false },
  subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  social: {
    twitter: { type: String, default: '' },
    telegram: { type: String, default: '' },
    github: { type: String, default: '' }
  },
  purchasedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
purchasedMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
gallery: [String], // список URL к медиа
});

// Хешируем пароль перед сохранением
userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  this.password = crypto.createHash('sha256').update(this.password).digest('hex');
  next();
});

// Метод для сравнения пароля
userSchema.methods.comparePassword = function (inputPassword) {
  const hash = crypto.createHash('sha256').update(inputPassword).digest('hex');
  return this.password === hash;
};

module.exports = mongoose.model('User', userSchema);
