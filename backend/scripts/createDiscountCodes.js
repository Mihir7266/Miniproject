const mongoose = require('mongoose');
const Discount = require('./models/Discount');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/GardenGrains1', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const sampleDiscounts = [
  {
    code: 'WELCOME10',
    description: '10% off on your first order',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 0,
    maxDiscountAmount: 100,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    usageLimit: null,
    isActive: true
  },
  {
    code: 'SAVE50',
    description: 'Flat ₹50 off on orders above ₹500',
    discountType: 'fixed',
    discountValue: 50,
    minOrderAmount: 500,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    usageLimit: 1000,
    isActive: true
  },
  {
    code: 'BIG20',
    description: '20% off on orders above ₹1000',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 1000,
    maxDiscountAmount: 200,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    usageLimit: 500,
    isActive: true
  }
];

async function seedDiscounts() {
  try {
    console.log('Creating sample discount codes...');
    
    for (const discount of sampleDiscounts) {
      try {
        const existing = await Discount.findOne({ code: discount.code });
        if (existing) {
          console.log(`Discount code ${discount.code} already exists, skipping...`);
          continue;
        }
        
        const newDiscount = new Discount(discount);
        await newDiscount.save();
        console.log(`✓ Created discount code: ${discount.code}`);
      } catch (error) {
        console.error(`Failed to create ${discount.code}:`, error.message);
      }
    }
    
    console.log('\n✅ Sample discount codes created successfully!');
    console.log('\nHere are the available promo codes:');
    console.log('- WELCOME10: 10% off on first order');
    console.log('- SAVE50: Flat ₹50 off on orders above ₹500');
    console.log('- BIG20: 20% off on orders above ₹1000');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding discount codes:', error);
    process.exit(1);
  }
}

seedDiscounts();

