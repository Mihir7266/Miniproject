# 🧪 Testing Discount Codes

## ✅ Discount Codes Created Successfully!

The following promo codes have been added to your database:

### Available Promo Codes:

1. **WELCOME10** 
   - 10% off on orders above ₹1000
   - Maximum discount: ₹100
   - No usage limit
   - Valid for 1 year

2. **SAVE50**
   - Flat ₹50 off on orders above ₹500
   - Usage limit: 1000 times
   - Valid for 1 year

3. **BIG20**
   - 20% off on orders above ₹1000
   - Maximum discount: ₹200
   - Usage limit: 500 times
   - Valid for 1 year

## 🧪 How to Test

### 1. Start Backend Server
```bash
cd backend
npm start
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test in Checkout Page
1. Go to http://localhost:3001
2. Log in as a user
3. Add items to cart (ensure total is above minimum)
4. Go to Checkout page
5. Enter a promo code (e.g., "SAVE50")
6. Click "Apply"
7. You should see the discount applied!

## 🔍 Testing with Different Totals

### Test SAVE50 (minimum ₹500)
- Add items worth ₹500 or more
- Enter code: `SAVE50`
- Expected: Get ₹50 off

### Test WELCOME10 (minimum ₹1000)
- Add items worth ₹1000 or more
- Enter code: `WELCOME10`
- Expected: Get 10% off (max ₹100)

### Test BIG20 (minimum ₹1000)
- Add items worth ₹1000 or more
- Enter code: `BIG20`
- Expected: Get 20% off (max ₹200)

## ❌ Expected Errors

### Minimum Order Error
If you try to use a code with cart total below minimum:
```
Minimum order amount of ₹1000 required for this discount
```

### Invalid Code Error
If you enter a wrong code:
```
Invalid or expired discount code
```

## 🐛 Troubleshooting

### Issue: "Cannot connect to server"
**Solution**: Make sure backend is running on port 5000

### Issue: "Authentication failed"
**Solution**: Make sure you're logged in as a user

### Issue: Discount not applying
**Solution**: 
1. Check browser console for errors
2. Check backend logs for API errors
3. Verify cart total meets minimum requirement
4. Try different code

## 📝 Quick Debug Steps

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try applying code
4. Check the API request:
   - URL: `http://localhost:5000/api/discounts/validate`
   - Status: Should be 200
   - Response: Should have `valid: true`

## ✅ Success Response Example
```json
{
  "valid": true,
  "discount": {
    "code": "SAVE50",
    "description": "Flat ₹50 off on orders above ₹500",
    "discountAmount": 50,
    "type": "fixed"
  }
}
```

## ⚠️ Important Notes

- Make sure MongoDB is running
- Make sure backend server is running
- Make sure frontend is running
- User must be logged in
- Cart total must meet minimum order amount

