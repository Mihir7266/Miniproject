# Garden Grains Restaurant - Smart Ordering System

A comprehensive full-stack web application for restaurant management with online ordering, reservations, and admin dashboard.

## 🌱 Features

### Customer Features
- **User Authentication**: Secure registration and login with JWT
- **Interactive Menu**: Browse, search, and filter menu items with images and descriptions
- **Shopping Cart**: Add items with customizations and special instructions
- **Order Management**: Place orders, track status in real-time, and view order history
- **Payment Integration**: Secure online payments with Stripe
- **Reservations**: Book tables with special requests and occasion details
- **AI Chatbot**: Intelligent assistant for menu help, order tracking, and FAQs
- **Email Notifications**: Order confirmations, status updates, and promotional offers
- **Loyalty Program**: Earn points and redeem rewards
- **Profile Management**: Update personal information and preferences

### Admin Features
- **Dashboard Analytics**: Revenue, orders, customers, and performance metrics
- **Menu Management**: Add, edit, delete menu items with categories and customizations
- **Order Management**: View, update order status, and manage kitchen operations
- **Reservation Management**: Handle table bookings and confirmations
- **User Management**: View and manage customer accounts
- **Reports & Analytics**: Sales reports, customer insights, and performance metrics
- **Inventory Tracking**: Monitor stock levels and availability
- **Email Notifications**: Admin alerts for new orders, low stock, and feedback

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Stripe** for payment processing
- **Nodemailer** for email notifications
- **OpenAI API** for AI chatbot
- **Express Validator** for input validation
- **Helmet** for security
- **CORS** for cross-origin requests

### Frontend
- **React 18** with Vite
- **TailwindCSS** for styling
- **React Router** for navigation
- **React Query** for data fetching
- **React Hook Form** for form management
- **Framer Motion** for animations
- **Recharts** for data visualization
- **React Hot Toast** for notifications
- **Heroicons** for icons

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Gmail account for email notifications
- Stripe account for payments
- OpenAI API key for chatbot

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd garden-grains-restaurant
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp env.example .env
   ```

3. **Configure Environment Variables**
   Edit `backend/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/garden-grains
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   GMAIL_USER=yourrestaurant@gmail.com
   GMAIL_PASS=your-app-password
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   OPENAI_API_KEY=your-openai-api-key
   FRONTEND_URL=http://localhost:3000
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Start the Application**
   
   **Terminal 1 (Backend):**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Terminal 2 (Frontend):**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

## 📁 Project Structure

```
garden-grains-restaurant/
├── backend/
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   ├── server.js         # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts
│   │   ├── services/     # API services
│   │   └── App.jsx       # Main app component
│   ├── public/           # Static assets
│   └── package.json
└── README.md
```

## 🔧 Configuration

### Gmail Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `GMAIL_PASS`

### Stripe Setup
1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe dashboard
3. Add them to your `.env` file

### OpenAI Setup
1. Create an OpenAI account at https://openai.com
2. Generate an API key
3. Add it to your `.env` file

### MongoDB Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGODB_URI` in your `.env` file

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Password reset

### Menu
- `GET /api/menu` - Get menu items (with filters)
- `GET /api/menu/:id` - Get single menu item
- `POST /api/menu` - Create menu item (Admin)
- `PUT /api/menu/:id` - Update menu item (Admin)
- `DELETE /api/menu/:id` - Delete menu item (Admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `POST /api/orders/:id/feedback` - Add order feedback

### Reservations
- `POST /api/reservations` - Create reservation
- `GET /api/reservations` - Get user reservations
- `PUT /api/reservations/:id/status` - Update reservation status (Admin)
- `DELETE /api/reservations/:id` - Cancel reservation

### Payments
- `POST /api/payments/create-payment-intent` - Create Stripe payment intent
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/payments/refund` - Process refund

### Chatbot
- `POST /api/chatbot/chat` - Send message to AI assistant
- `GET /api/chatbot/suggestions` - Get menu suggestions
- `GET /api/chatbot/faq` - Get frequently asked questions

### Admin
- `GET /api/admin/dashboard` - Get dashboard data
- `GET /api/admin/users` - Get all users
- `GET /api/admin/analytics/sales` - Get sales analytics
- `GET /api/admin/analytics/customers` - Get customer analytics

## 🎨 UI Components

### Key Components
- **Navbar**: Navigation with user menu and cart
- **Footer**: Links and contact information
- **MenuCard**: Display menu items with images and details
- **Cart**: Shopping cart with item management
- **OrderCard**: Order display with status tracking
- **Chatbot**: AI assistant for customer support
- **AdminDashboard**: Analytics and management interface

### Styling
- **TailwindCSS** for utility-first styling
- **Custom color palette** with warm tones
- **Responsive design** for mobile-first approach
- **Smooth animations** with Framer Motion
- **Modern UI components** with consistent design

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password hashing** with bcrypt
- **Input validation** with express-validator
- **Rate limiting** to prevent abuse
- **CORS configuration** for secure cross-origin requests
- **Helmet** for security headers
- **Environment variables** for sensitive data

## 📧 Email Notifications

The system sends automated emails for:
- **Order confirmations** with details and estimated time
- **Order status updates** (confirmed, preparing, ready, served)
- **Reservation confirmations** with booking details
- **Password reset** with secure tokens
- **Admin alerts** for new orders and low stock
- **Promotional offers** and loyalty program updates

## 🤖 AI Chatbot Features

- **Menu recommendations** based on preferences
- **Order tracking** with order ID lookup
- **FAQ responses** for common questions
- **Reservation assistance** with availability
- **Dietary information** and allergen details
- **Restaurant information** and contact details

## 📊 Admin Dashboard

### Analytics Included
- **Revenue tracking** with daily/monthly reports
- **Order statistics** with status distribution
- **Customer insights** with loyalty metrics
- **Menu performance** with top-selling items
- **Sales trends** with interactive charts
- **User activity** with engagement metrics

## 🚀 Deployment

### Backend Deployment
1. Deploy to platforms like Heroku, Railway, or DigitalOcean
2. Set up MongoDB Atlas for production database
3. Configure environment variables
4. Set up email service (Gmail or SendGrid)
5. Configure Stripe for production payments

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or AWS
3. Configure environment variables
4. Update API URLs for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: info@gardengrains.com
- Phone: +1 (555) 123-4567
- Website: https://gardengrains.com

## 🙏 Acknowledgments

- React and Node.js communities
- TailwindCSS for beautiful styling
- Stripe for payment processing
- OpenAI for AI capabilities
- MongoDB for database management

---

**Garden Grains Restaurant** - Fresh • Healthy • Delicious 🌱
# Miniproject
