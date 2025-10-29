const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: false
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: false
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 500
  },
  type: {
    type: String,
    enum: ['menu', 'order', 'restaurant'],
    default: 'menu'
  }
}, {
  timestamps: true
});

// Prevent duplicate ratings
feedbackSchema.index({ user: 1, menuItem: 1 }, { unique: true, sparse: true });
feedbackSchema.index({ user: 1, order: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Feedback', feedbackSchema);

