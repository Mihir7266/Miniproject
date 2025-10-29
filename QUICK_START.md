# Quick Start - Garden Grains

## Follow these steps to get started:

### 1. Create .env file in backend directory

Create `backend/.env` file with this content:

```env
MONGODB_URI=mongodb://localhost:27017/GardenGrains1
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 2. Seed the database

```bash
cd backend
npm install
npm run seed
```

### 3. Start the backend server

```bash
npm run dev
```

### 4. Start the frontend (in a new terminal)

```bash
cd frontend
npm install
npm run dev
```

### 5. Open in browser

Visit: `http://localhost:5173`

---

## What was fixed:

✅ Fixed menu items not showing in dashboard
✅ Connected to MongoDB at `localhost:27017/GardenGrains1`
✅ Created seed script with 10 sample menu items
✅ Fixed API response data structure
✅ Added proper error handling

The dashboard will now show menu items once you seed the database!

