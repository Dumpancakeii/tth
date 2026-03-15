// server.js
const fastify = require('fastify')({ logger: true });
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/bronze56k')
  .then(() => console.log('MongoDB connected'));

// Middleware для авторизации
fastify.decorate('authenticate', async (request, reply) => {
  const token = request.headers.authorization?.split(' ')[1];
  if (!token) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }
  // Проверка токена...
  request.user = { id: 1, role: 'customer' };
});

// Маршруты для товаров
fastify.get('/api/products', async (request, reply) => {
  const { category, minPrice, maxPrice, search, sort, page = 1, limit = 12 } = request.query;
  
  const query = { isActive: true };
  
  if (category) {
    query['category.slug'] = category;
  }
  
  if (minPrice || maxPrice) {
    query['pricing.rub'] = {};
    if (minPrice) query['pricing.rub'].$gte = Number(minPrice);
    if (maxPrice) query['pricing.rub'].$lte = Number(maxPrice);
  }
  
  if (search) {
    query.$text = { $search: search };
  }
  
  const sortOptions = {};
  if (sort === 'price_asc') sortOptions['pricing.rub'] = 1;
  if (sort === 'price_desc') sortOptions['pricing.rub'] = -1;
  if (sort === 'newest') sortOptions.createdAt = -1;
  
  const products = await Product.find(query)
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(limit);
    
  const total = await Product.countDocuments(query);
  
  return {
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
});

fastify.get('/api/products/:id', async (request, reply) => {
  const product = await Product.findById(request.params.id)
    .populate('category.id');
    
  if (!product) {
    return reply.status(404).send({ error: 'Product not found' });
  }
  
  // Увеличиваем счетчик просмотров
  product.stats.views += 1;
  await product.save();
  
  return product;
});

// Маршруты для корзины
fastify.post('/api/cart/add', { preHandler: [fastify.authenticate] }, async (request, reply) => {
  const { productId, quantity = 1, variantId } = request.body;
  const userId = request.user.id;
  
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    return reply.status(404).send({ error: 'Product not found' });
  }
  
  // Получаем или создаем корзину
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }
  
  // Проверяем, есть ли уже такой товар
  const existingItem = cart.items.find(item => 
    item.productId.toString() === productId && 
    item.variantId === variantId
  );
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      productId,
      variantId,
      name: product.name,
      price: product.pricing.rub,
      quantity,
      image: product.images.find(img => img.isMain)?.thumb
    });
  }
  
  await cart.save();
  
  return { message: 'Added to cart', cart };
});

// Маршруты для заказов
fastify.post('/api/orders', { preHandler: [fastify.authenticate] }, async (request, reply) => {
  const { shippingAddress, paymentMethod } = request.body;
  const userId = request.user.id;
  
  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0) {
    return reply.status(400).send({ error: 'Cart is empty' });
  }
  
  // Начинаем сессию для транзакции
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Создаем заказ
    const order = new Order({
      orderNumber: 'ORD-' + Date.now(),
      userId,
      items: cart.items,
      subtotal: cart.subtotal,
      total: cart.total,
      shippingAddress,
      paymentMethod,
      status: 'pending',
      paymentStatus: 'pending',
      shippingStatus: 'pending'
    });
    
    await order.save({ session });
    
    // Обновляем статистику пользователя
    await User.findByIdAndUpdate(userId, {
      $inc: { 'stats.ordersCount': 1, 'stats.totalSpent': cart.total },
      $set: { 'stats.lastOrderAt': new Date() }
    }, { session });
    
    // Обновляем количество товаров
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { 'inventory.quantity': -item.quantity, 'stats.soldCount': item.quantity }
      }, { session });
    }
    
    // Очищаем корзину
    await Cart.findByIdAndDelete(cart._id, { session });
    
    await session.commitTransaction();
    
    return { message: 'Order created', order };
    
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

// Админские маршруты
fastify.post('/api/admin/products', { preHandler: [fastify.authenticate] }, async (request, reply) => {
  if (request.user.role !== 'admin') {
    return reply.status(403).send({ error: 'Forbidden' });
  }
  
  const product = new Product(request.body);
  await product.save();
  
  return product;
});

fastify.put('/api/admin/products/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
  if (request.user.role !== 'admin') {
    return reply.status(403).send({ error: 'Forbidden' });
  }
  
  const product = await Product.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true }
  );
  
  return product;
});

// Запуск сервера
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();