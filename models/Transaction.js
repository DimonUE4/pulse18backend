const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // покупатель
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   // автор
  type: { type: String, enum: ['post', 'message', 'tip', 'subscription'], required: true },

  amount: { type: Number, required: true },
  relatedId: { type: mongoose.Schema.Types.ObjectId },
  description: String,
  status: { type: String, enum: ['processing', 'completed'], default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
