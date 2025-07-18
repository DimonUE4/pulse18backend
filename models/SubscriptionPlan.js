const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
  model: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  nextBillingAt: { type: Date }, // 👈 следующая дата списания
  price: { type: Number, required: true }
});

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
