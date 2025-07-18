const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  subscriber: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  model: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true }, // добавляем дату окончания
  isActive: { type: Boolean, default: true },
  autoRenew: { type: Boolean, default: true }, // флаг автопродления
  price: { type: Number, required: true }
});

// Один пользователь не может дважды подписаться на одну модель
subscriptionSchema.index({ subscriber: 1, model: 1 }, { unique: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
