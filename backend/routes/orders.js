const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');
const { sendEmail } = require('../utils/sendEmail');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', auth, [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.menuItem').isMongoId().withMessage('Invalid menu item ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('orderType').isIn(['dine-in', 'takeaway', 'delivery']).withMessage('Invalid order type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, orderType, deliveryAddress, notes } = req.body;
    let subtotal = 0;
    const orderItems = [];

    // Validate and calculate prices for each item
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return res.status(400).json({ message: `Menu item ${item.menuItem} not found` });
      }

      if (!menuItem.availability.isAvailable) {
        return res.status(400).json({ message: `${menuItem.name} is currently unavailable` });
      }

      let itemPrice = menuItem.price;
      
      // Add customization costs
      if (item.customization && item.customization.length > 0) {
        for (const custom of item.customization) {
          if (custom.selectedChoices) {
            for (const choice of custom.selectedChoices) {
              itemPrice += choice.price || 0;
            }
          }
        }
      }

      const totalItemPrice = itemPrice * item.quantity;
      subtotal += totalItemPrice;

      orderItems.push({
        menuItem: menuItem._id,
        quantity: item.quantity,
        price: itemPrice,
        customization: item.customization || [],
        specialInstructions: item.specialInstructions
      });
    }

    // Calculate totals
    const tax = subtotal * 0.18; // 18% GST
    const deliveryFee = orderType === 'delivery' ? 50 : 0;
    const total = subtotal + tax + deliveryFee;

    // Create order
    const order = new Order({
      customer: req.user._id,
      items: orderItems,
      subtotal,
      tax,
      deliveryFee,
      total,
      orderType,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : null,
      notes
    });

    await order.save();
    
    console.log('Order created successfully:', order.orderNumber);

    // Update user's loyalty points (1 point per ₹10 spent)
    const pointsEarned = Math.floor(total / 10);
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { loyaltyPoints: pointsEarned }
    });

    // Send order confirmation email to customer
    try {
      await sendEmail(
        req.user.email,
        `Order Confirmation - ${order.orderNumber}`,
        `
        <h2>Order Confirmation</h2>
        <p>Dear ${req.user.name},</p>
        <p>Thank you for your order! Here are the details:</p>
        <div class="highlight">
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Order Type:</strong> ${order.orderType}</p>
          <p><strong>Total Amount:</strong> ₹${total.toFixed(2)}</p>
          <p><strong>Estimated Time:</strong> ${order.estimatedTime} minutes</p>
        </div>
        <h3>Order Items:</h3>
        <ul>
          ${orderItems.map(item => `
            <li>${item.quantity}x ${item.menuItem.name} - ₹${item.price.toFixed(2)} each</li>
          `).join('')}
        </ul>
        <p>You can track your order status in your account.</p>
        <p>Best regards,<br>Garden Grains Team</p>
        `
      );
    } catch (emailError) {
      console.error('Order confirmation email failed:', emailError);
    }

    // Notify admin(s) about new order
    try {
      const adminUsers = await User.find({ role: 'admin', isActive: true }).select('name email');

      if (adminUsers && adminUsers.length > 0) {
        const adminEmails = adminUsers.map(admin => admin.email);

        await sendEmail(
          adminEmails,
          `New Order Placed - ${order.orderNumber}`,
          `
          <h2>New Order Placed</h2>
          <p>A new order has been placed in the system.</p>
          <div class="highlight">
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Customer Name:</strong> ${req.user.name}</p>
            <p><strong>Customer Email:</strong> ${req.user.email}</p>
            <p><strong>Order Type:</strong> ${order.orderType}</p>
            <p><strong>Total Amount:</strong> ₹${total.toFixed(2)}</p>
          </div>
          <p>You can view and manage this order from the admin panel.</p>
          <p>Best regards,<br>Garden Grains System</p>
          `
        );
      }
    } catch (adminEmailError) {
      console.error('Admin new-order notification email failed:', adminEmailError);
    }

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
        estimatedTime: order.estimatedTime
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { customer: req.user._id };
    
    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const orders = await Order.find(filter)
      .populate('items.menuItem', 'name price images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.menuItem', 'name price images description')
      .populate('customer', 'name email phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order or is admin
    if (order.customer._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Admin only)
router.put('/:id/status', adminAuth, [
  body('status').isIn(['pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled'])
    .withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, kitchenNotes } = req.body;
    const order = await Order.findById(req.params.id).populate('customer');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const oldStatus = order.status;
    order.status = status;
    if (kitchenNotes) order.kitchenNotes = kitchenNotes;

    await order.save();

    // Send status update email
    try {
      const statusMessages = {
        'confirmed': 'Your order has been confirmed and is being prepared.',
        'preparing': 'Your order is being prepared in our kitchen.',
        'ready': 'Your order is ready for pickup!',
        'served': 'Your order has been served. Enjoy your meal!',
        'cancelled': 'Your order has been cancelled.'
      };

      await sendEmail(
        order.customer.email,
        `Order Status Update - ${order.orderNumber}`,
        `
        <h2>Order Status Update</h2>
        <p>Dear ${order.customer.name},</p>
        <p>Your order status has been updated:</p>
        <div class="highlight">
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Status:</strong> ${order.statusDisplay}</p>
          <p>${statusMessages[status] || 'Your order status has been updated.'}</p>
        </div>
        <p>Thank you for choosing Garden Grains!</p>
        <p>Best regards,<br>Garden Grains Team</p>
        `
      );
    } catch (emailError) {
      console.error('Status update email failed:', emailError);
    }

    res.json({
      message: 'Order status updated successfully',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        statusDisplay: order.statusDisplay
      }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/admin/all
// @desc    Get all orders (Admin only)
// @access  Private (Admin only)
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, dateFrom, dateTo } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const orders = await Order.find(filter)
      .populate('customer', 'name email phone')
      .populate('items.menuItem', 'name price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/orders/:id/feedback
// @desc    Add feedback to order
// @access  Private
router.post('/:id/feedback', auth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (order.status !== 'served') {
      return res.status(400).json({ message: 'Feedback can only be submitted for served orders' });
    }

    order.feedback = {
      rating,
      comment,
      submittedAt: new Date()
    };

    await order.save();

    res.json({
      message: 'Feedback submitted successfully',
      feedback: order.feedback
    });
  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
