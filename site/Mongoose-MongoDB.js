// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  firstName: String,
  lastName: String,
  phone: String,
  role: { type: String, default: 'customer' },
  isActive: { type: Boolean, default: true },
  addresses: [{
    type: { type: String, default: 'shipping' },
    recipientName: String,
    phone: String,
    country: String,
    city: String,
    street: String,
    building: String,
    apartment: String,
    postalCode: String,
    isDefault: { type: Boolean, default: false }
  }],
  stats: {
    ordersCount: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastOrderAt: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);

// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  category: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    name: String,
    slug: String
  },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  pricing: {
    usd: { type: Number, required: true },
    rub: Number,
    compareAtUsd: Number,
    costUsd: Number
  },
  inventory: {
    sku: String,
    quantity: { type: Number, default: 0 },
    reserved: { type: Number, default: 0 }
  },
  variants: [{
    size: String,
    color: String,
    colorCode: String,
    quantity: Number,
    sku: String
  }],
  images: [{
    url: String,
    thumb: String,
    isMain: { type: Boolean, default: false },
    altText: String
  }],
  tags: [String],
  attributes: {
    material: String,
    care: String,
    origin: String,
    weight: Number
  },
  seo: {
    title: String,
    description: String,
    keywords: String
  },
  stats: {
    views: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isNew: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Виртуальное поле для доступного количества
productSchema.virtual('inventory.available').get(function() {
  return this.inventory.quantity - this.inventory.reserved;
});

module.exports = mongoose.model('Product', productSchema);