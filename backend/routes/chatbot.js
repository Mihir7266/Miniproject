const express = require('express');
const { body, validationResult } = require('express-validator');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/chatbot/chat
// @desc    Chat with AI assistant
// @access  Private
router.post('/chat', auth, [
  body('message').trim().isLength({ min: 1, max: 500 }).withMessage('Message must be between 1 and 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message, orderId } = req.body;
    const lowerMessage = message.toLowerCase();

    // Get menu items for context
    const menuItems = await MenuItem.find({ 'availability.isAvailable': true })
      .select('name description price category dietaryInfo')
      .limit(20);

    // Intelligent response system without OpenAI
    let response = '';

    // Get order context if orderId provided
    let orderContext = '';
    if (orderId) {
      const order = await Order.findById(orderId)
        .populate('items.menuItem', 'name price')
        .select('orderNumber status items total');
      
      if (order && order.customer.toString() === req.user._id.toString()) {
        orderContext = `
        Current Order Information:
        - Order Number: ${order.orderNumber}
        - Status: ${order.status}
        - Total: ₹${order.total}
        - Items: ${order.items.map(item => `${item.quantity}x ${item.menuItem.name}`).join(', ')}
        `;
      }
    }

    // Rule-based intelligent responses
    if (lowerMessage.includes('menu') || lowerMessage.includes('item') || lowerMessage.includes('food')) {
      const menuList = menuItems.slice(0, 5).map(item => 
        `• ${item.name} - ₹${item.price} (${item.category})`
      ).join('\n');
      response = `Here are some of our popular items:\n\n${menuList}\n\nTo view the complete menu, visit our Menu page or ask about specific dishes!`;
    }
    else if (lowerMessage.includes('time') || lowerMessage.includes('open') || lowerMessage.includes('hours')) {
      response = "We're open Monday through Sunday from 11:00 AM to 10:00 PM. For reservations, you can book online or call us!";
    }
    else if (lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('where')) {
      response = "We're located at 123 Green Street, Garden City. You can call us at +1 (555) 123-4567 for directions.";
    }
    else if (lowerMessage.includes('reservation') || lowerMessage.includes('book') || lowerMessage.includes('table')) {
      response = "Yes! You can make a reservation through our Reservations page. We have available slots throughout the day. Just select your preferred date and time!";
    }
    else if (lowerMessage.includes('vegetarian') || lowerMessage.includes('vegan')) {
      response = "Absolutely! We offer a wide variety of vegetarian and vegan options made with fresh, organic ingredients. Try our Paneer Tikka, Dal Tadka, or Masala Dosa!";
    }
    else if (lowerMessage.includes('spicy') || lowerMessage.includes('hot')) {
      response = "We have dishes for every spice preference! Our menu includes mild, medium, and hot options. Just let us know your preference when ordering.";
    }
    else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('expensive')) {
      response = "Our prices range from ₹40 to ₹500 depending on the dish. Most items are between ₹150-₹350. Visit our Menu page to see detailed pricing!";
    }
    else if (lowerMessage.includes('order') && (lowerMessage.includes('track') || lowerMessage.includes('status'))) {
      response = "You can track your order in the My Orders section. Just enter your order number or view it in your account dashboard!";
    }
    else if (lowerMessage.includes('delivery')) {
      response = "Yes! We offer delivery within a 5-mile radius. Delivery fee is ₹50 and orders are delivered within 30-45 minutes. Select 'Delivery' as your order type at checkout!";
    }
    else if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
      response = "We accept Cash on Delivery! Just select 'Cash on Delivery' when placing your order. Online payment options coming soon!";
    }
    else if (lowerMessage.includes('popular') || lowerMessage.includes('best') || lowerMessage.includes('recommend')) {
      const popularItems = menuItems.filter(item => item.isPopular).slice(0, 3);
      if (popularItems.length > 0) {
        const list = popularItems.map(item => `• ${item.name} - ₹${item.price}`).join('\n');
        response = `Our most popular dishes:\n\n${list}\n\nThese are customer favorites! 😊`;
      } else {
        response = "I'd recommend trying our Butter Chicken, Paneer Tikka, or Chicken Biryani - they're always a hit! Check our menu for more options.";
      }
    }
    else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      response = "Hello! Welcome to Garden Grains! 🌱 I'm here to help with menu questions, reservations, order tracking, and more. How can I assist you today?";
    }
    else if (lowerMessage.includes('help') || lowerMessage.includes('what can you')) {
      response = "I can help you with:\n• Menu recommendations\n• Restaurant hours & location\n• Making reservations\n• Tracking orders\n• Dietary preferences\n• Pricing information\n\nWhat would you like to know?";
    }
    else if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('call')) {
      response = "You can reach us at:\nPhone: +1 (555) 123-4567\nLocation: 123 Green Street, Garden City\nHours: 11 AM - 10 PM (Daily)";
    }
    else if (lowerMessage.includes('loyalty') || lowerMessage.includes('points') || lowerMessage.includes('reward')) {
      response = "Yes! We have a loyalty program. Earn 1 point for every ₹10 spent. Points can be redeemed for discounts and special offers. Check your profile to see your points!";
    }
    else {
      // Default helpful response
      response = "I'd be happy to help! Here are some things I can assist with:\n\n• Menu items and recommendations\n• Restaurant hours and location\n• Making reservations\n• Order tracking\n• Dietary information\n• Pricing\n\nWhat would you like to know about Garden Grains?";
    }

    res.json({
      message: response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    
    res.json({
      message: "I'm having trouble right now. Please try asking about our menu, hours, or reservations. Or call us at +1 (555) 123-4567.",
      timestamp: new Date().toISOString(),
      isFallback: true
    });
  }
});

// @route   GET /api/chatbot/suggestions
// @desc    Get menu suggestions based on preferences
// @access  Private
router.get('/suggestions', auth, async (req, res) => {
  try {
    const { category, dietary, priceRange } = req.query;
    const filter = { 'availability.isAvailable': true };

    if (category) filter.category = category;
    if (dietary) {
      switch (dietary) {
        case 'vegetarian':
          filter['dietaryInfo.isVegetarian'] = true;
          break;
        case 'vegan':
          filter['dietaryInfo.isVegan'] = true;
          break;
        case 'gluten-free':
          filter['dietaryInfo.isGlutenFree'] = true;
          break;
      }
    }
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filter.price = { $gte: min, $lte: max };
    }

    const suggestions = await MenuItem.find(filter)
      .select('name description price category images dietaryInfo')
      .sort({ 'ratings.average': -1 })
      .limit(6);

    res.json({ suggestions });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/chatbot/faq
// @desc    Get frequently asked questions
// @access  Public
router.get('/faq', async (req, res) => {
  try {
    const faqs = [
      {
        question: "What are your operating hours?",
        answer: "We're open Monday through Sunday from 11:00 AM to 10:00 PM."
      },
      {
        question: "Do you offer vegetarian and vegan options?",
        answer: "Yes! We have a wide variety of vegetarian and vegan dishes made with fresh, organic ingredients."
      },
      {
        question: "Can I make a reservation?",
        answer: "Absolutely! You can make reservations through our website, mobile app, or by calling us at +1 (555) 123-4567."
      },
      {
        question: "Do you offer delivery?",
        answer: "Yes, we offer delivery within a 5-mile radius. Delivery fee is ₹50 and orders are delivered within 30-45 minutes."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept cash, credit/debit cards, UPI, and online payments through our website."
      },
      {
        question: "Do you accommodate dietary restrictions?",
        answer: "Yes, we can accommodate various dietary restrictions including gluten-free, nut allergies, and other specific requirements. Please mention your needs when ordering."
      },
      {
        question: "How can I track my order?",
        answer: "You can track your order in real-time through your account dashboard or by using your order number."
      },
      {
        question: "Do you have a loyalty program?",
        answer: "Yes! Earn 1 point for every ₹10 spent. Points can be redeemed for discounts and special offers."
      }
    ];

    res.json({ faqs });
  } catch (error) {
    console.error('Get FAQ error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
