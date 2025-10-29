const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true,
    lowercase: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter time in HH:MM format']
  },
  partySize: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  tablePreference: {
    type: String,
    enum: ['any', 'window', 'corner', 'private', 'outdoor'],
    default: 'any'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  specialRequests: String,
  occasion: {
    type: String,
    enum: ['birthday', 'anniversary', 'business', 'date', 'family', 'other'],
    default: 'other'
  },
  confirmationCode: {
    type: String,
    unique: true,
    sparse: true
  },
  notes: String,
  confirmedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  confirmedAt: Date,
  reminderSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Generate confirmation code before saving
reservationSchema.pre('save', async function(next) {
  if (this.isNew && !this.confirmationCode) {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.confirmationCode = `RES${code}`;
  }
  next();
});

// Index for efficient queries
reservationSchema.index({ date: 1, time: 1 });
reservationSchema.index({ customer: 1, date: -1 });
reservationSchema.index({ status: 1 });

// Virtual for formatted date and time
reservationSchema.virtual('formattedDateTime').get(function() {
  const date = new Date(this.date);
  const time = this.time;
  return {
    date: date.toLocaleDateString('en-IN'),
    time: time,
    datetime: `${date.toLocaleDateString('en-IN')} at ${time}`
  };
});

module.exports = mongoose.model('Reservation', reservationSchema);
