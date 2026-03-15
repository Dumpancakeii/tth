// Коллекция: users
{
  _id: ObjectId,
  email: "user@example.com",
  passwordHash: "...",
  profile: {
    firstName: "John",
    lastName: "Doe",
    phone: "+79991234567",
    avatar: "url.jpg"
  },
  role: "customer",
  isActive: true,
  addresses: [
    {
      type: "shipping",
      recipientName: "John Doe",
      phone: "+79991234567",
      country: "Russia",
      city: "Moscow",
      street: "Tverskaya",
      building: "15",
      apartment: "42",
      postalCode: "101000",
      isDefault: true
    }
  ],
  stats: {
    ordersCount: 5,
    totalSpent: 45000,
    lastOrderAt: ISODate("2025-03-15")
  },
  createdAt: ISODate("2025-01-01"),
  updatedAt: ISODate("2025-03-20")
}

// Коллекция: products
{
  _id: ObjectId,
  category: {
    id: ObjectId,
    name: "Hoodies",
    slug: "hoodies"
  },
  name: "FAUX SUEDE PUFFER BLACK",
  slug: "faux-suede-puffer-black",
  description: "Premium faux suede puffer jacket...",
  pricing: {
    usd: 230,
    rub: 20700,
    compareAtUsd: 280,
    costUsd: 120
  },
  inventory: {
    sku: "FS-PB-001",
    quantity: 50,
    reserved: 5,
    available: 45
  },
  variants: [
    {
      size: "S",
      color: "Black",
      colorCode: "#000000",
      quantity: 10,
      sku: "FS-PB-001-S"
    },
    {
      size: "M",
      color: "Black",
      colorCode: "#000000",
      quantity: 20,
      sku: "FS-PB-001-M"
    }
  ],
  images: [
    {
      url: "products/001/main.jpg",
      thumb: "products/001/main-thumb.jpg",
      isMain: true,
      altText: "Black puffer front view"
    },
    {
      url: "products/001/back.jpg",
      thumb: "products/001/back-thumb.jpg",
      isMain: false
    }
  ],
  tags: ["new", "bestseller", "winter"],
  attributes: {
    material: "100% Polyester",
    care: "Machine wash cold",
    origin: "Imported",
    weight: 1.2
  },
  seo: {
    title: "Faux Suede Puffer Black | BRONZE56K",
    description: "Premium faux suede puffer jacket...",
    keywords: ["puffer", "jacket", "black"]
  },
  stats: {
    views: 1500,
    soldCount: 35,
    ratingAvg: 4.5,
    ratingCount: 28
  },
  isActive: true,
  isFeatured: true,
  isNew: true,
  createdAt: ISODate("2025-02-01"),
  updatedAt: ISODate("2025-03-18")
}

// Коллекция: orders
{
  _id: ObjectId,
  orderNumber: "ORD-2025-001",
  user: {
    id: ObjectId,
    email: "user@example.com",
    name: "John Doe"
  },
  status: {
    main: "shipped",
    payment: "paid",
    shipping: "in_transit"
  },
  items: [
    {
      productId: ObjectId,
      variantId: ObjectId,
      name: "FAUX SUEDE PUFFER BLACK",
      size: "M",
      color: "Black",
      quantity: 1,
      pricePerUnit: 20700,
      total: 20700
    }
  ],
  totals: {
    subtotal: 20700,
    discount: 0,
    shipping: 500,
    tax: 0,
    total: 21200
  },
  payment: {
    method: "card",
    transactionId: "pay_123456",
    paidAt: ISODate("2025-03-19T10:30:00Z")
  },
  shipping: {
    address: {
      recipient: "John Doe",
      phone: "+79991234567",
      city: "Moscow",
      street: "Tverskaya 15",
      postalCode: "101000"
    },
    method: "standard",
    trackingNumber: "TRK-789012",
    estimatedDelivery: ISODate("2025-03-25")
  },
  timeline: [
    { status: "pending", at: ISODate("2025-03-19T10:30:00Z") },
    { status: "paid", at: ISODate("2025-03-19T10:31:00Z") },
    { status: "processing", at: ISODate("2025-03-19T14:00:00Z") },
    { status: "shipped", at: ISODate("2025-03-20T09:00:00Z") }
  ],
  createdAt: ISODate("2025-03-19T10:30:00Z"),
  updatedAt: ISODate("2025-03-20T09:00:00Z")
}

// Коллекция: cart (для MongoDB часто хранят в Redis, но можно и здесь)
{
  _id: ObjectId,
  userId: ObjectId,
  sessionId: "sess_abc123",
  items: [
    {
      productId: ObjectId,
      variantId: ObjectId,
      name: "FAUX SUEDE PUFFER BLACK",
      price: 20700,
      quantity: 1,
      image: "products/001/thumb.jpg"
    }
  ],
  totals: {
    subtotal: 20700,
    total: 21200
  },
  expiresAt: ISODate("2025-03-22T10:30:00Z"),
  updatedAt: ISODate("2025-03-19T10:30:00Z")
}

// Коллекция: categories
{
  _id: ObjectId,
  name: "Outerwear",
  slug: "outerwear",
  description: "Jackets, coats, and puffers",
  parentId: null, // или ObjectId для подкатегории
  image: "categories/outerwear.jpg",
  sortOrder: 1,
  productCount: 15,
  isActive: true,
  seo: {
    title: "Outerwear | BRONZE56K",
    description: "Shop our collection of jackets and coats"
  }
}

// Коллекция: promotions
{
  _id: ObjectId,
  code: "WELCOME50",
  type: "percentage", // fixed, percentage, free_shipping
  value: 50, // 50%
  minOrder: 1000,
  usage: {
    limit: 1000,
    used: 234
  },
  appliesTo: {
    type: "all", // all, category, product
    ids: [] // если category или product
  },
  dates: {
    start: ISODate("2025-01-01"),
    end: ISODate("2025-12-31")
  },
  isActive: true
}