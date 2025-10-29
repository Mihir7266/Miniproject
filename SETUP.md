# Garden Grains Restaurant - Setup Guide

This guide will help you set up the Garden Grains Restaurant Smart Ordering System on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

### Optional but Recommended:
- **MongoDB Compass** - GUI for MongoDB
- **Postman** - For API testing
- **VS Code** - Code editor

## 🚀 Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd garden-grains-restaurant
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env
```

### 3. Configure Environment Variables

Edit the `backend/.env` file with your configuration:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/garden-grains

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Gmail Configuration (Required for email notifications)
GMAIL_USER=yourrestaurant@gmail.com
GMAIL_PASS=your-app-password

# Stripe Configuration (Required for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# OpenAI Configuration (Required for chatbot)
OPENAI_API_KEY=your-openai-api-key

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

### 5. Start MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service (Windows)
net start MongoDB

# Start MongoDB service (macOS/Linux)
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
- Create a free cluster
- Get connection string and update `MONGODB_URI` in `.env`

### 6. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 7. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🔧 Service Configuration

### Gmail Setup (Required for Email Notifications)

1. **Enable 2-Factor Authentication**
   - Go to your Google Account settings
   - Security → 2-Step Verification
   - Follow the setup process

2. **Generate App Password**
   - Go to Google Account → Security
   - 2-Step Verification → App passwords
   - Select "Mail" and generate password
   - Use this password in `GMAIL_PASS`

### Stripe Setup (Required for Payments)

1. **Create Stripe Account**
   - Go to [Stripe](https://stripe.com)
   - Sign up for a free account

2. **Get API Keys**
   - Go to Stripe Dashboard → Developers → API Keys
   - Copy "Publishable key" and "Secret key"
   - Add them to your `.env` file

3. **Test Mode**
   - Use test keys (starting with `pk_test_` and `sk_test_`)
   - Use test card numbers for testing

### OpenAI Setup (Required for Chatbot)

1. **Create OpenAI Account**
   - Go to [OpenAI](https://openai.com)
   - Sign up and verify your account

2. **Get API Key**
   - Go to API Keys section
   - Create new secret key
   - Add it to your `.env` file

## 🧪 Testing the Setup

### 1. Test Backend API

```bash
# Health check
curl http://localhost:5000/api/health

# Expected response:
{
  "status": "OK",
  "message": "Garden Grains API is running"
}
```

### 2. Test Frontend

- Open http://localhost:3000
- You should see the Garden Grains homepage
- Try registering a new account

### 3. Test Database Connection

```bash
# Check if MongoDB is running
mongo --eval "db.adminCommand('ismaster')"

# Or use MongoDB Compass to connect to localhost:27017
```

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- Ensure MongoDB is running
- Check if port 27017 is available
- Try restarting MongoDB service

**2. Gmail Authentication Error**
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```
**Solution:**
- Use App Password instead of regular password
- Ensure 2FA is enabled
- Check Gmail credentials

**3. Stripe Payment Error**
```
Error: No such payment_intent
```
**Solution:**
- Use correct Stripe test keys
- Ensure keys are for the right environment (test/live)
- Check Stripe dashboard for API key status

**4. OpenAI API Error**
```
Error: Invalid API key
```
**Solution:**
- Verify API key is correct
- Check OpenAI account billing
- Ensure API key has proper permissions

**5. Port Already in Use**
```
Error: listen EADDRINUSE :::5000
```
**Solution:**
- Kill process using the port: `lsof -ti:5000 | xargs kill -9`
- Or change PORT in `.env` file

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=*
```

## 📱 Creating Sample Data

### 1. Create Admin User

```bash
# Use MongoDB Compass or mongo shell
# Connect to your database and run:

db.users.insertOne({
  name: "Admin User",
  email: "admin@gardengrains.com",
  password: "$2a$12$...", // Hashed password
  role: "admin",
  isActive: true,
  createdAt: new Date()
})
```

### 2. Add Sample Menu Items

```bash
# Add sample menu items through the admin panel
# Or use the API endpoints to create items
```

## 🔒 Security Considerations

### Production Setup

1. **Environment Variables**
   - Never commit `.env` files
   - Use environment variable management
   - Rotate secrets regularly

2. **Database Security**
   - Use MongoDB Atlas for production
   - Enable network access controls
   - Use strong authentication

3. **API Security**
   - Use HTTPS in production
   - Implement rate limiting
   - Validate all inputs

4. **Email Security**
   - Use dedicated email service (SendGrid, Mailgun)
   - Implement email verification
   - Monitor email delivery

## 📊 Monitoring

### Health Checks

- **Backend**: http://localhost:5000/api/health
- **Database**: Check MongoDB connection
- **Email**: Test email sending
- **Payments**: Test Stripe integration

### Logs

- **Backend logs**: Check terminal output
- **Database logs**: MongoDB logs
- **Error tracking**: Implement error monitoring

## 🚀 Deployment Preparation

### Before Deploying

1. **Environment Variables**
   - Set production values
   - Use secure secrets
   - Configure CORS properly

2. **Database**
   - Use MongoDB Atlas
   - Set up backups
   - Configure indexes

3. **Email Service**
   - Use production email service
   - Configure SPF/DKIM records
   - Test email delivery

4. **Payment Processing**
   - Use live Stripe keys
   - Configure webhooks
   - Test payment flows

## 📞 Support

If you encounter issues:

1. **Check the logs** for error messages
2. **Verify all services** are running
3. **Check environment variables** are correct
4. **Test each service** individually
5. **Review the documentation** for configuration details

### Getting Help

- Check the main README.md for detailed information
- Review API documentation
- Test with Postman or similar tools
- Check browser console for frontend errors

---

**Happy Coding! 🌱**

Your Garden Grains Restaurant system should now be running successfully!
