# Quick Start - Access Admin Panel

## 🚀 Quick Steps to Access Admin Panel

### 1. Make sure servers are running

**Backend Server:**
```bash
cd backend
npm run dev
```
Should show: "Server running on port 5000"

**Frontend Server:**
```bash
cd frontend
npm run dev
```
Should show the URL (usually http://localhost:5173)

---

### 2. Open Browser

Go to: **http://localhost:5173** (or the URL shown in your terminal)

---

### 3. Login

1. Click **"Login"** button (top right corner)
2. Enter credentials:
   - **Email:** admin@gardengrains.com
   - **Password:** admin123
3. Click **"Sign In"**

---

### 4. Access Admin Panel

**Option A: Through Navigation Menu**
1. After login, click on your name (top right)
2. Dropdown menu appears
3. Click **"Admin Panel"**

**Option B: Direct URL**
Simply navigate to: `http://localhost:5173/admin/panel`

---

### 5. Use Admin Panel

You'll see tabs at the top:
- **Menu Items** - Manage your menu
- **Orders** - View all orders
- **Reservations** - View all reservations
- **Users** - View all users

---

## 📝 Add Your First Menu Item

1. Click **"Menu Items"** tab
2. Click **"Add Menu Item"** button
3. Fill the form:
   - Name: "Test Item"
   - Description: "This is a test"
   - Price: 100
   - Category: Choose from dropdown
   - Check "Available"
4. Click **"Add Menu Item"**
5. Done! It's now on your menu at /menu

---

## 🔑 Quick Reference

**Login URL:** http://localhost:5173/login
**Admin Panel:** http://localhost:5173/admin/panel
**Dashboard:** http://localhost:5173/admin
**Public Menu:** http://localhost:5173/menu

**Admin Credentials:**
- Email: admin@gardengrains.com
- Password: admin123

---

## ❓ Having Trouble?

**Can't login?**
- Make sure backend is running
- Check terminal for errors
- Try: `cd backend && npm run create-admin`

**404 Error?**
- Make sure both servers are running
- Check the correct port number in terminal

**Admin Panel not showing?**
- Make sure you're logged in as admin
- Check that user has role: 'admin'

---

## 💡 Pro Tips

1. Keep the backend terminal open to see what's happening
2. Use browser DevTools (F12) to check for errors
3. The admin panel is protected - only admin users can access it
4. All changes are saved to MongoDB database

