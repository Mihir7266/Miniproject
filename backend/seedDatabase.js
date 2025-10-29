const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
const User = require('./models/User');
const Order = require('./models/Order');
const Reservation = require('./models/Reservation');
require('dotenv').config();

const seedMenuItems = [
  {
    name: 'Paneer Tikka',
    description: 'Grilled cubes of paneer marinated in spices and yogurt, served with mint chutney',
    price: 280,
    category: 'main-course',
    subcategory: 'Vegetarian',
    images: [{
      url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500',
      alt: 'Paneer Tikka',
      isPrimary: true
    }],
    ingredients: ['Paneer', 'Yogurt', 'Spices', 'Bell Peppers', 'Onions'],
    allergens: ['Dairy'],
    dietaryInfo: {
      isVegetarian: true,
      isSpicy: true,
      spiceLevel: 'medium'
    },
    availability: {
      isAvailable: true
    },
    nutrition: {
      calories: 320,
      protein: 18,
      carbs: 12,
      fat: 22,
      fiber: 2
    },
    ratings: {
      average: 4.5,
      count: 45
    },
    isPopular: true,
    isFeatured: true,
    preparationTime: 20,
    tags: ['Vegetarian', 'Popular']
  },
  {
    name: 'Butter Chicken',
    description: 'Creamy tomato-based curry with tender chicken pieces',
    price: 350,
    category: 'main-course',
    subcategory: 'Non-Vegetarian',
    images: [{
      url: 'https://images.unsplash.com/photo-1563379091339-6a21f28d3e7b?w=500',
      alt: 'Butter Chicken',
      isPrimary: true
    }],
    ingredients: ['Chicken', 'Tomatoes', 'Cream', 'Butter', 'Spices'],
    allergens: ['Dairy', 'Gluten'],
    dietaryInfo: {
      isVegetarian: false,
      isSpicy: true,
      spiceLevel: 'mild'
    },
    availability: {
      isAvailable: true
    },
    nutrition: {
      calories: 425,
      protein: 32,
      carbs: 18,
      fat: 28,
      fiber: 3
    },
    ratings: {
      average: 4.8,
      count: 78
    },
    isPopular: true,
    isFeatured: true,
    preparationTime: 25,
    tags: ['Popular', 'Best Seller']
  },
  {
    name: 'Dal Tadka',
    description: 'Yellow lentils tempered with spices, garlic, and herbs',
    price: 220,
    category: 'main-course',
    subcategory: 'Vegetarian',
    images: [{
      url: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=500',
      alt: 'Dal Tadka',
      isPrimary: true
    }],
    ingredients: ['Lentils', 'Tomatoes', 'Onions', 'Garlic', 'Spices'],
    allergens: [],
    dietaryInfo: {
      isVegetarian: true,
      isVegan: true,
      isSpicy: true,
      spiceLevel: 'medium'
    },
    availability: {
      isAvailable: true
    },
    nutrition: {
      calories: 180,
      protein: 12,
      carbs: 28,
      fat: 4,
      fiber: 10
    },
    ratings: {
      average: 4.3,
      count: 52
    },
    isPopular: false,
    isFeatured: false,
    preparationTime: 30,
    tags: ['Vegan', 'Healthy']
  },
  {
    name: 'Naan Bread',
    description: 'Traditional leavened flatbread baked in tandoor oven',
    price: 40,
    category: 'appetizers',
    subcategory: 'Bread',
    images: [{
      url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500',
      alt: 'Naan Bread',
      isPrimary: true
    }],
    ingredients: ['Flour', 'Yogurt', 'Yeast', 'Butter', 'Salt'],
    allergens: ['Gluten', 'Dairy'],
    dietaryInfo: {
      isVegetarian: true,
      isSpicy: false
    },
    availability: {
      isAvailable: true
    },
    nutrition: {
      calories: 320,
      protein: 10,
      carbs: 52,
      fat: 8,
      fiber: 2
    },
    ratings: {
      average: 4.6,
      count: 89
    },
    isPopular: true,
    isFeatured: false,
    preparationTime: 10,
    tags: ['Popular']
  },
  {
    name: 'Chicken Biryani',
    description: 'Fragrant basmati rice cooked with marinated chicken and aromatic spices',
    price: 320,
    category: 'main-course',
    subcategory: 'Non-Vegetarian',
    images: [{
      url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500',
      alt: 'Chicken Biryani',
      isPrimary: true
    }],
    ingredients: ['Basmati Rice', 'Chicken', 'Onions', 'Spices', 'Herbs', 'Yogurt'],
    allergens: ['Dairy'],
    dietaryInfo: {
      isVegetarian: false,
      isSpicy: true,
      spiceLevel: 'hot'
    },
    availability: {
      isAvailable: true
    },
    nutrition: {
      calories: 520,
      protein: 35,
      carbs: 65,
      fat: 15,
      fiber: 4
    },
    ratings: {
      average: 4.7,
      count: 92
    },
    isPopular: true,
    isFeatured: true,
    preparationTime: 40,
    tags: ['Popular', 'Best Seller', 'Spicy']
  },
  {
    name: 'Gulab Jamun',
    description: 'Sweet milk-based dumplings soaked in sugar syrup',
    price: 80,
    category: 'desserts',
    subcategory: 'Indian Dessert',
    images: [{
      url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500',
      alt: 'Gulab Jamun',
      isPrimary: true
    }],
    ingredients: ['Milk Solids', 'Sugar', 'Rose Water', 'Cardamom'],
    allergens: ['Dairy'],
    dietaryInfo: {
      isVegetarian: true,
      isSpicy: false
    },
    availability: {
      isAvailable: true
    },
    nutrition: {
      calories: 280,
      protein: 5,
      carbs: 42,
      fat: 12,
      fiber: 0
    },
    ratings: {
      average: 4.4,
      count: 65
    },
    isPopular: true,
    isFeatured: false,
    preparationTime: 5,
    tags: ['Popular']
  },
  {
    name: 'Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potato curry, served with chutneys',
    price: 150,
    category: 'main-course',
    subcategory: 'South Indian',
    images: [{
      url: 'https://images.unsplash.com/photo-1589372975647-3e0e6ec93f71?w=500',
      alt: 'Masala Dosa',
      isPrimary: true
    }],
    ingredients: ['Rice', 'Lentils', 'Potatoes', 'Onions', 'Spices'],
    allergens: [],
    dietaryInfo: {
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      isSpicy: true,
      spiceLevel: 'medium'
    },
    availability: {
      isAvailable: true
    },
    nutrition: {
      calories: 380,
      protein: 8,
      carbs: 55,
      fat: 14,
      fiber: 6
    },
    ratings: {
      average: 4.5,
      count: 58
    },
    isPopular: true,
    isFeatured: false,
    preparationTime: 15,
    tags: ['Vegan', 'Gluten Free']
  },
  {
    name: 'Mango Lassi',
    description: 'Refreshing yogurt drink blended with sweet mango and cardamom',
    price: 90,
    category: 'beverages',
    subcategory: 'Lassi',
    images: [{
      url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500',
      alt: 'Mango Lassi',
      isPrimary: true
    }],
    ingredients: ['Yogurt', 'Mango', 'Sugar', 'Cardamom', 'Ice'],
    allergens: ['Dairy'],
    dietaryInfo: {
      isVegetarian: true,
      isSpicy: false
    },
    availability: {
      isAvailable: true
    },
    nutrition: {
      calories: 180,
      protein: 5,
      carbs: 32,
      fat: 4,
      fiber: 1
    },
    ratings: {
      average: 4.6,
      count: 72
    },
    isPopular: true,
    isFeatured: false,
    preparationTime: 3,
    tags: ['Popular', 'Refreshing']
  },
  {
    name: 'Aloo Gobi',
    description: 'Potatoes and cauliflower cooked with turmeric, cumin, and spices',
    price: 240,
    category: 'main-course',
    subcategory: 'Vegetarian',
    images: [{
      url: 'https://images.unsplash.com/photo-1572442383846-9c5c2ffe972a?w=500',
      alt: 'Aloo Gobi',
      isPrimary: true
    }],
    ingredients: ['Potatoes', 'Cauliflower', 'Tomatoes', 'Onions', 'Spices'],
    allergens: [],
    dietaryInfo: {
      isVegetarian: true,
      isVegan: true,
      isSpicy: true,
      spiceLevel: 'medium'
    },
    availability: {
      isAvailable: true
    },
    nutrition: {
      calories: 220,
      protein: 6,
      carbs: 28,
      fat: 8,
      fiber: 8
    },
    ratings: {
      average: 4.2,
      count: 38
    },
    isPopular: false,
    isFeatured: false,
    preparationTime: 22,
    tags: ['Vegan', 'Healthy']
  },
  {
    name: 'Tandoori Chicken',
    description: 'Marinated chicken cooked in traditional tandoor oven',
    price: 380,
    category: 'main-course',
    subcategory: 'Non-Vegetarian',
    images: [{
      url: 'https://images.unsplash.com/photo-1609501676725-e59d40f08a9e?w=500',
      alt: 'Tandoori Chicken',
      isPrimary: true
    }],
    ingredients: ['Chicken', 'Yogurt', 'Spices', 'Lemon'],
    allergens: ['Dairy'],
    dietaryInfo: {
      isVegetarian: false,
      isSpicy: true,
      spiceLevel: 'hot'
    },
    availability: {
      isAvailable: true
    },
    nutrition: {
      calories: 280,
      protein: 42,
      carbs: 8,
      fat: 10,
      fiber: 1
    },
    ratings: {
      average: 4.7,
      count: 84
    },
    isPopular: true,
    isFeatured: true,
    preparationTime: 30,
    tags: ['Popular', 'Best Seller', 'Spicy']
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/GardenGrains1');
    console.log('MongoDB Connected...');

    // Clear existing data (optional - comment out if you want to keep existing data)
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items...');

    // Insert menu items
    await MenuItem.insertMany(seedMenuItems);
    console.log('Menu items seeded successfully!');

    console.log(`\n✅ Successfully seeded ${seedMenuItems.length} menu items into the database`);
    console.log('\nMenu items:');
    seedMenuItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} - ₹${item.price} (${item.category})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

