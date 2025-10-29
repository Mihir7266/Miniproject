const express = require('express');
const { body, validationResult } = require('express-validator');
const Discount = require('../models/Discount');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/discounts/validate
// @desc    Validate and apply discount code
// @access  Private
router.post('/validate', auth, [
  body('code').notEmpty().withMessage('Discount code is required'),
  body('orderTotal').isNumeric().withMessage('Order total must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, orderTotal } = req.body;
    const now = new Date();

    const discount = await Discount.findOne({
      code: code.toUpperCase(),
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now }
    });

    if (!discount) {
      return res.status(400).json({ message: 'Invalid or expired discount code' });
    }

    // Check usage limit
    if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
      return res.status(400).json({ message: 'Discount code has reached its usage limit' });
    }

    // Check minimum order amount
    if (orderTotal < discount.minOrderAmount) {
      return res.status(400).json({ 
        message: `Minimum order amount of ₹${discount.minOrderAmount} required for this discount` 
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (discount.discountType === 'percentage') {
      discountAmount = (orderTotal * discount.discountValue) / 100;
      if (discount.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, discount.maxDiscountAmount);
      }
    } else {
      discountAmount = discount.discountValue;
    }

    res.json({
      valid: true,
      discount: {
        code: discount.code,
        description: discount.description,
        discountAmount: Math.round(discountAmount * 100) / 100,
        type: discount.discountType
      }
    });
  } catch (error) {
    console.error('Validate discount error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/discounts
// @desc    Get all active discount codes
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const now = new Date();
    const discounts = await Discount.find({
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now },
      $or: [
        { usageLimit: null },
        { usedCount: { $lt: { $ifNull: ['$usageLimit', Number.MAX_SAFE_INTEGER] } } }
      ]
    }).select('code description discountType discountValue minOrderAmount validUntil');

    res.json({ discounts });
  } catch (error) {
    console.error('Get discounts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/discounts
// @desc    Create new discount code (Admin only)
// @access  Private (Admin only)
router.post('/', adminAuth, [
  body('code').notEmpty().withMessage('Code is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('discountType').isIn(['percentage', 'fixed']).withMessage('Invalid discount type'),
  body('discountValue').isNumeric().withMessage('Discount value must be a number'),
  body('validFrom').isISO8601().withMessage('Valid from must be a valid date'),
  body('validUntil').isISO8601().withMessage('Valid until must be a valid date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const discount = new Discount(req.body);
    discount.code = discount.code.toUpperCase();
    await discount.save();

    res.status(201).json({
      message: 'Discount code created successfully',
      discount
    });
  } catch (error) {
    console.error('Create discount error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Discount code already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

