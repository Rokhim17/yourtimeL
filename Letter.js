const mongoose = require('mongoose');

const LetterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  message: String,
  fileUrl: String,
  openDate: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Letter', LetterSchema);
