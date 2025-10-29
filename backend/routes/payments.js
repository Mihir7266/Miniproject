const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/payments/create-payment-intent
// @desc    Create payment intent for Stripe
// @access  Private
router.post('/create-payment-intent', auth, [
  body('orderId').isMongoId().withMessage('Invalid order ID'),
  body('amount').isNumeric().withMessage('Amount must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId, amount } = req.body;

    // Verify order exists and belongs to user
    const order = await Order.findOne({
      _id: orderId,
      customer: req.user._id,
      paymentStatus: 'pending'
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or already paid' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'inr',
      metadata: {
        orderId: orderId,
        customerId: req.user._id.toString()
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/payments/confirm
// @desc    Confirm payment and update order
// @access  Private
router.post('/confirm', auth, [
  body('orderId').isMongoId().withMessage('Invalid order ID'),
  body('paymentIntentId').notEmpty().withMessage('Payment intent ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId, paymentIntentId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not successful' });
    }

    // Update order
    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
        customer: req.user._id,
        paymentStatus: 'pending'
      },
      {
        paymentStatus: 'paid',
        paymentId: paymentIntentId,
        paymentMethod: 'card'
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found or already paid' });
    }

    res.json({
      message: 'Payment confirmed successfully',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        total: order.total
      }
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/payments/refund
// @desc    Process refund
// @access  Private
router.post('/refund', auth, [
  body('orderId').isMongoId().withMessage('Invalid order ID'),
  body('amount').optional().isNumeric().withMessage('Amount must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId, amount } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      customer: req.user._id,
      paymentStatus: 'paid'
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or not paid' });
    }

    if (!order.paymentId) {
      return res.status(400).json({ message: 'No payment ID found for this order' });
    }

    // Create refund
    const refundAmount = amount ? Math.round(amount * 100) : undefined;
    const refund = await stripe.refunds.create({
      payment_intent: order.paymentId,
      amount: refundAmount,
      reason: 'requested_by_customer'
    });

    // Update order status
    order.paymentStatus = 'refunded';
    await order.save();

    res.json({
      message: 'Refund processed successfully',
      refund: {
        id: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      }
    });
  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
