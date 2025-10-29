# How to Access the Admin Panel

## Step-by-Step Guide

### 1. Create an Admin User

First, you need to create an admin user in the database. Open a terminal in the `backend` directory and run:

```bash
cd backend
npm run create-admin
```

This will create an admin user with the following credentials:
- **Email:** admin@gardengrains.com
- **Password:** admin123

### 2. Start the Backend Server

Make sure the backend is running:

```bash
npm run dev
```

The backend should be running on `http://localhost:5000`

### 3. Start the Frontend Server

Open another terminal and start the frontend:

```bash
cd frontend
npm run dev
```

The frontend should be running on `http://localhost:5173`

### 4. Login as Admin

1. Open your browser and go to: `http://localhost:5173` (or the port your frontend is using)
2. Click on **"Login"** in the top right
3. Enter the admin credentials:
   - Email: `admin@gardengrains.com`
   - Password: `admin123`
4. Click **"Sign In"**

### 5. Access Admin Panel

After logging in, you'll see your name in the top right. Click on it to open the menu, then select **"Admin Panel"**.

Or you can directly navigate to:
- `http://localhost:5173/admin/panel`

### 6. Using the Admin Panel

The admin panel has **4 main tabs**:

#### 📋 Menu Items Tab
- View all menu items
- Click **"Add Menu Item"** to add new items
- Click the **pencil icon** to edit an item
- Click the **trash icon** to delete an item

**To Add a New Menu Item:**
1. Click "Add Menu Item" button
2. Fill in the form:
   - **Name**: Item name (e.g., "Paneer Butter Masala")
   - **Description**: Item description
   - **Price**: Price in ₹
   - **Category**: Select from dropdown
   - **Available**: Check if item is available
   - **Popular**: Check to mark as popular
   - **Featured**: Check to feature on homepage
3. Click "Add Menu Item"

#### 🛒 Orders Tab
- View all orders
- See customer details, order numbers, dates, and status

#### 📅 Reservations Tab
- View all reservations
- See date, time, party size, and customer details

#### 👥 Users Tab
- View all users
- See user details, roles, and status

## Features

✅ **Add Menu Items** - Create new menu items with details
✅ **Edit Menu Items** - Update existing menu items
✅ **Delete Menu Items** - Remove items from menu
✅ **View Orders** - See all customer orders
✅ **View Reservations** - Manage table reservations
✅ **View Users** - See all registered users

## Quick Access

- **Admin Panel**: `/admin/panel`
- **Dashboard**: `/admin`
- **Menu Management**: `/admin/menu`
- **Orders**: `/admin/orders`
- **Reservations**: `/admin/reservations`

## Important Notes

⚠️ **Security**: After first login, change the admin password for security.

⚠️ **Menu Items**: The items you add will appear on the public menu page at `/menu`

## Troubleshooting

**Can't login?**
- Make sure the backend server is running
- Check if you created the admin user with `npm run create-admin`
- Try clearing browser cache and cookies

**Admin Panel not showing?**
- Make sure you're logged in as a user with `role: 'admin'`
- Check your user role in the database

**Page not found?**
- Make sure the backend is running on port 5000
- Check if MongoDB is connected
- Look for errors in the terminal

## Need Help?

If you encounter any issues:
1. Check the browser console for errors (F12)
2. Check the backend terminal for error messages
3. Ensure MongoDB is running
4. Make sure both frontend and backend servers are running

