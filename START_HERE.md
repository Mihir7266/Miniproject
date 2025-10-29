# 🌱 Welcome to Garden Grains Restaurant System

## 🚀 Quick Start Guide

### 1. Setup Database
```bash
# Make sure MongoDB is running
# The system connects to: mongodb://127.0.0.1:27017/GardenGrains1
```

### 2. Start Backend
```bash
cd backend
npm install
npm run seed           # Seed menu items
npm run create-admin   # Create admin user
npm run create-discounts # Create sample promo codes
npm start              # Start backend server (port 5000)
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev            # Start frontend (port 3001)
```

### 4. Access the System
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3001/admin/panel

### 5. Login Credentials

#### Admin Login
- **Email**: admin@gardengrains.com
- **Password**: admin123

#### Create Customer Account
- Go to http://localhost:3001/register
- Or use the Register button in navbar

## ✨ Sample Promo Codes

- **WELCOME10**: 10% off on your first order
- **SAVE50**: Flat ₹50 off on orders above ₹500
- **BIG20**: 20% off on orders above ₹1000

## 🎯 All Features Implemented

### Customer Features
✅ User Registration & Login
✅ Browse Interactive Menu
✅ Search & Filter Menu Items
✅ Add to Cart & Checkout
✅ Place Orders (Cash on Delivery)
✅ Track Order Status (Real-time)
✅ View Order History
✅ Make Table Reservations
✅ Apply Promo Codes
✅ Earn & View Loyalty Points
✅ Rate & Review Menu Items
✅ Print Bills
✅ Chat with AI Assistant

### Admin Features
✅ Dashboard with Analytics
✅ Manage Menu Items (Add/Edit/Delete)
✅ View & Manage All Orders
✅ View & Manage Reservations
✅ Manage Users
✅ Create Discount Codes
✅ View Reports & Analytics
✅ Inventory Management Interface
✅ Customer Communication Tools

### System Features
✅ Secure Authentication (JWT)
✅ Email Notifications (Ready)
✅ Real-time Order Tracking
✅ Payment System (COD + Stripe ready)
✅ Mobile Responsive Design
✅ Print Functionality
✅ AI Chatbot
✅ Loyalty Program

## 📱 Complete Module List

### Module 1: User Management ✅
- Registration with email, phone, address
- Authentication & Authorization
- Profile Management
- Role-based Access Control

### Module 2: Digital Menu ✅
- Interactive menu with images
- Detailed descriptions & prices
- Categories & Dietary filters
- Search functionality
- Customization options
- Ratings & Reviews

### Module 3: Order Management ✅
- Place orders (Dine-in/Takeaway/Delivery)
- Real-time status tracking
- Order history
- Order details
- Tax calculation
- Delivery fee

### Module 4: Payment System ✅
- Cash on Delivery
- Payment status tracking
- Stripe integration ready
- Automatic calculations

### Module 5: Search & Filters ✅
- Search by name/description/tags
- Filter by category
- Filter by dietary preferences
- Price range filters
- Sort options
- Availability filters

### Module 6: AI Chatbot ✅
- Smart rule-based responses
- Menu recommendations
- FAQ answers
- Order status checks
- Restaurant information

### Module 7: Reservations ✅
- Book tables
- Date/time selection
- Party size
- Special requests
- Occasion selection
- Admin management

### Module 8: Notifications ✅
- Email notifications (configured)
- Toast notifications
- Order confirmations
- Status updates
- Reservation confirmations

### Module 9: Feedback & Ratings ✅
- Rate menu items (1-5 stars)
- Add comments/reviews
- Aggregate ratings
- Display reviews

### Module 10: Admin Panel ✅
- Dashboard
- Menu Management
- Order Management
- User Management
- Reservation Management
- Analytics & Reports

### Module 11: Discount System ✅
- Promo code validation
- Percentage discounts
- Fixed discounts
- Usage limits
- Time-based validity
- Admin creation

### Module 12: Loyalty Program ✅
- Earn points (1 per ₹10)
- Points display
- Accumulation
- Ready for redemption

## 🎨 Pages Available

1. **Home** (/) - Landing page
2. **Menu** (/menu) - Browse menu
3. **Cart** (/cart) - Shopping cart
4. **Checkout** (/checkout) - Place order
5. **Orders** (/orders) - Order history
6. **Reservations** (/reservations) - Book tables
7. **Profile** (/profile) - User profile
8. **Register** (/register) - Create account
9. **Login** (/login) - Sign in
10. **Admin Panel** (/admin/panel) - Admin dashboard
11. **Admin Menu** (/admin/menu) - Manage menu
12. **Admin Orders** (/admin/orders) - Manage orders
13. **Admin Reservations** (/admin/reservations) - Manage bookings
14. **Admin Users** (/admin/users) - Manage users

## 📝 Configuration Files

### Backend (.env)
```env
MONGODB_URI=mongodb://127.0.0.1:27017/GardenGrains1
PORT=5000
JWT_SECRET=your-secret-key
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
STRIPE_SECRET_KEY=sk_test_... (optional)
FRONTEND_URL=http://localhost:3001
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## 🔧 Troubleshooting

### Issue: Cannot connect to database
**Solution**: Make sure MongoDB is running
```bash
mongod
```

### Issue: Port already in use
**Solution**: Change port in backend/.env or kill the process
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID [PID] /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Issue: Registration fails
**Solution**: Check phone number format (minimum 10 digits)

### Issue: Cart not showing
**Solution**: Clear browser cache and localStorage

## 📊 Database Collections

1. `users` - User accounts
2. `menuitems` - Menu items
3. `orders` - Orders
4. `reservations` - Table reservations
5. `feedback` - Reviews & ratings
6. `discounts` - Promo codes
7. `payments` - Payment records

## 🎯 Next Steps (Optional)

1. **Configure Email**: Add Gmail credentials in `.env`
2. **Add Stripe Keys**: For online payments
3. **Customize Menu**: Add more items via Admin Panel
4. **Create More Promos**: Use admin panel or scripts
5. **Deploy**: Use Vercel (frontend) + Heroku/Render (backend)

## 📚 Documentation

- `FEATURES_IMPLEMENTATION.md` - Complete feature list
- `COMPLETE_FEATURES_LIST.md` - All features with details
- `DATABASE_SETUP.md` - Database setup guide
- `ADMIN_GUIDE.md` - Admin panel usage

## ✨ Everything is Ready!

Your complete restaurant management system is fully functional with ALL requested features implemented!

**Happy coding! 🎉**

