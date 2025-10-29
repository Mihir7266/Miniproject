const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['appetizers', 'main-course', 'desserts', 'beverages', 'salads', 'soups', 'specials']
  },
  subcategory: {
    type: String,
    trim: true
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  ingredients: [String],
  allergens: [String],
  dietaryInfo: {
    isVegetarian: { type: Boolean, default: false },
    isVegan: { type: Boolean, default: false },
    isGlutenFree: { type: Boolean, default: false },
    isSpicy: { type: Boolean, default: false },
    spiceLevel: {
      type: String,
      enum: ['mild', 'medium', 'hot'],
      default: 'mild'
    }
  },
  customization: {
    hasOptions: { type: Boolean, default: false },
    options: [{
      name: String,
      type: {
        type: String,
        enum: ['single', 'multiple'],
        default: 'single'
      },
      choices: [{
        name: String,
        price: { type: Number, default: 0 }
      }]
    }]
  },
  availability: {
    isAvailable: { type: Boolean, default: true },
    availableDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    availableTimes: {
      start: String, // Format: "HH:MM"
      end: String
    }
  },
  nutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  isPopular: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  preparationTime: {
    type: Number, // in minutes
    default: 15
  },
  tags: [String]
}, {
  timestamps: true
});

// Index for search functionality
menuItemSchema.index({ 
  name: 'text', 
  description: 'text', 
  ingredients: 'text',
  tags: 'text'
});

// Virtual for formatted price
menuItemSchema.virtual('formattedPrice').get(function() {
  return `₹${this.price.toFixed(2)}`;
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
