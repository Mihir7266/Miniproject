const express = require('express');
const { body, validationResult } = require('express-validator');
const Reservation = require('../models/Reservation');
const { auth, adminAuth } = require('../middleware/auth');
const { sendEmail } = require('../utils/sendEmail');

const router = express.Router();

// @route   POST /api/reservations
// @desc    Create new reservation
// @access  Private
router.post('/', auth, [
  body('date').isISO8601().withMessage('Invalid date format'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format'),
  body('partySize').isInt({ min: 1, max: 20 }).withMessage('Party size must be between 1 and 20'),
  body('customerName').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('customerPhone').matches(/^[\d\s-()+]{10,}$/).withMessage('Please enter a valid phone number (at least 10 digits)'),
  body('customerEmail').isEmail().normalizeEmail().withMessage('Invalid email')
], async (req, res) => {
  try {
    console.log('Received reservation data:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      date,
      time,
      partySize,
      customerName,
      customerPhone,
      customerEmail,
      tablePreference,
      specialRequests,
      occasion
    } = req.body;

    // Check if reservation date is in the future
    const reservationDate = new Date(date);
    const now = new Date();
    if (reservationDate <= now) {
      return res.status(400).json({ message: 'Reservation date must be in the future' });
    }

    // Create reservation
    const reservation = new Reservation({
      customer: req.user._id,
      customerName,
      customerPhone,
      customerEmail,
      date: reservationDate,
      time,
      partySize,
      tablePreference,
      specialRequests,
      occasion
    });

    await reservation.save();

    // Send confirmation email
    try {
      await sendEmail(
        customerEmail,
        `Reservation Confirmation - ${reservation.confirmationCode}`,
        `
        <h2>Reservation Confirmed!</h2>
        <p>Dear ${customerName},</p>
        <p>Your reservation has been confirmed. Here are the details:</p>
        <div class="highlight">
          <p><strong>Confirmation Code:</strong> ${reservation.confirmationCode}</p>
          <p><strong>Date:</strong> ${reservation.formattedDateTime.date}</p>
          <p><strong>Time:</strong> ${reservation.formattedDateTime.time}</p>
          <p><strong>Party Size:</strong> ${partySize} people</p>
          <p><strong>Table Preference:</strong> ${tablePreference}</p>
          ${specialRequests ? `<p><strong>Special Requests:</strong> ${specialRequests}</p>` : ''}
        </div>
        <p>We look forward to serving you!</p>
        <p>Best regards,<br>Garden Grains Team</p>
        `
      );
    } catch (emailError) {
      console.error('Reservation confirmation email failed:', emailError);
    }

    res.status(201).json({
      message: 'Reservation created successfully',
      reservation: {
        id: reservation._id,
        confirmationCode: reservation.confirmationCode,
        date: reservation.formattedDateTime.date,
        time: reservation.formattedDateTime.time,
        partySize: reservation.partySize,
        status: reservation.status
      }
    });
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reservations
// @desc    Get user's reservations
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { customer: req.user._id };
    
    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const reservations = await Reservation.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Reservation.countDocuments(filter);

    res.json({
      reservations,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Get reservations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reservations/admin/all
// @desc    Get all reservations (Admin only)
// @access  Private (Admin only)
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, date } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const reservations = await Reservation.find(filter)
      .populate('customer', 'name email phone')
      .sort({ date: 1, time: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Reservation.countDocuments(filter);

    res.json({
      reservations,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Get all reservations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/reservations/:id/status
// @desc    Update reservation status
// @access  Private (Admin only)
router.put('/:id/status', adminAuth, [
  body('status').isIn(['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no-show'])
    .withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, notes } = req.body;
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    reservation.status = status;
    if (notes) reservation.notes = notes;
    if (status === 'confirmed') {
      reservation.confirmedBy = req.user._id;
      reservation.confirmedAt = new Date();
    }

    await reservation.save();

    res.json({
      message: 'Reservation status updated successfully',
      reservation: {
        id: reservation._id,
        confirmationCode: reservation.confirmationCode,
        status: reservation.status,
        date: reservation.formattedDateTime.date,
        time: reservation.formattedDateTime.time
      }
    });
  } catch (error) {
    console.error('Update reservation status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/reservations/:id
// @desc    Cancel reservation
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (reservation.status === 'completed' || reservation.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot cancel this reservation' });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    console.error('Cancel reservation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
