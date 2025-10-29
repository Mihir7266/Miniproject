# Database Setup Guide for Garden Grains

## MongoDB Connection

Your database is configured to connect to: `mongodb://localhost:27017/GardenGrains1`

## Quick Start

### Step 1: Ensure MongoDB is Running

Make sure you have MongoDB running on your local machine at `localhost:27017`.

**To install MongoDB:**
- Download from: https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

### Step 2: Create .env File

Create a `.env` file in the `backend` directory with the following content:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/GardenGrains1

# JWT
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# Gmail Configuration (optional)
GMAIL_USER=yourrestaurant@gmail.com
GMAIL_PASS=your-app-password

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# OpenAI (optional)
OPENAI_API_KEY=your-openai-api-key

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Step 3: Seed the Database with Sample Data

Navigate to the backend directory and run:

```bash
cd backend
npm run seed
```

This will:
- Connect to your MongoDB database
- Clear existing menu items (if any)
- Insert 10 sample menu items including:
  - Paneer Tikka
  - Butter Chicken
  - Dal Tadka
  - Naan Bread
  - Chicken Biryani
  - Gulab Jamun
  - Masala Dosa
  - Mango Lassi
  - Aloo Gobi
  - Tandoori Chicken

### Step 4: Start the Backend Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Step 5: Start the Frontend

In a new terminal, navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## Database Structure

### Collections in GardenGrains1 Database

1. **menuitems** - All menu items with categories, prices, ratings, etc.
2. **users** - Customer and admin user accounts
3. **orders** - Order history with status tracking
4. **reservations** - Table reservation data

### Viewing Data in MongoDB

To view your data, you can:

**Option 1: MongoDB Compass (Recommended GUI)**
- Download: https://www.mongodb.com/products/compass
- Connect to: `mongodb://localhost:27017`
- Select database: `GardenGrains1`

**Option 2: MongoDB Shell**
```bash
mongosh mongodb://localhost:27017/GardenGrains1
```

Then query:
```javascript
// View all menu items
db.menuitems.find()

// Count menu items
db.menuitems.countDocuments()

// Find popular items
db.menuitems.find({ isPopular: true })
```

## Troubleshooting

### MongoDB not connecting?

1. Check if MongoDB is running:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

2. Check MongoDB logs for errors

3. Verify connection string in `.env` file

### Menu items not showing?

1. Run the seed script again:
   ```bash
   npm run seed
   ```

2. Check if items exist in database:
   ```bash
   mongosh mongodb://localhost:27017/GardenGrains1
   db.menuitems.find()
   ```

3. Clear browser cache and restart both frontend and backend

### Dashboard showing 0 menu items?

1. Make sure the database is seeded
2. Verify MongoDB connection is working
3. Check browser console for API errors
4. Ensure backend is running on port 5000

## API Endpoints

Once connected, your data will be accessible via:

- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get single menu item
- `GET /api/admin/dashboard` - Get dashboard statistics
- `POST /api/menu` - Create new menu item (Admin only)
- `PUT /api/menu/:id` - Update menu item (Admin only)
- `DELETE /api/menu/:id` - Delete menu item (Admin only)

## Features Fixed

✅ Fixed dashboard menu items display
✅ Connected to MongoDB database
✅ Created seed script for sample data
✅ Fixed API data structure mismatch
✅ Added proper error handling for empty data

## Next Steps

1. Customize menu items through the admin panel
2. Add more menu items as needed
3. Create admin accounts
4. Start processing orders

Happy coding! 🎉

