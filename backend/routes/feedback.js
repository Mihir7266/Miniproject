const express = require('express');
const { body, validationResult } = require('express-validator');
const Feedback = require('../models/Feedback');
const MenuItem = require('../models/MenuItem');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/feedback/menu/:menuItemId
// @desc    Add rating and feedback for a menu item
// @access  Private
router.post('/menu/:menuItemId', auth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment } = req.body;
    const menuItem = await MenuItem.findById(req.params.menuItemId);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Check if user already rated
    const existingFeedback = await Feedback.findOne({
      user: req.user._id,
      menuItem: req.params.menuItemId
    });

    if (existingFeedback) {
      return res.status(400).json({ message: 'You have already rated this item' });
    }

    // Create feedback
    const feedback = new Feedback({
      user: req.user._id,
      menuItem: req.params.menuItemId,
      rating,
      comment,
      type: 'menu'
    });

    await feedback.save();

    // Update menu item ratings
    const allFeedbacks = await Feedback.find({ menuItem: req.params.menuItemId });
    const averageRating = allFeedbacks.reduce((sum, f) => sum + f.rating, 0) / allFeedbacks.length;

    await MenuItem.findByIdAndUpdate(req.params.menuItemId, {
      $set: {
        'ratings.average': averageRating,
        'ratings.count': allFeedbacks.length
      }
    });

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: {
        rating,
        comment,
        averageRating,
        totalRatings: allFeedbacks.length
      }
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/feedback/menu/:menuItemId
// @desc    Get feedbacks for a menu item
// @access  Public
router.get('/menu/:menuItemId', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ menuItem: req.params.menuItemId })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ feedbacks });
  } catch (error) {
    console.error('Get feedbacks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

