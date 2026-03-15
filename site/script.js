// ============================================
// TTH STORE - Единый файл JavaScript
// ============================================

// ---------- ГЛОБАЛЬНЫЕ ДАННЫЕ ----------
const products = [
    // Верхняя одежда (Outerwear)
    { id: 1, name: 'FAUX SUEDE PUFFER PLUM', price: 230.00, category: 'outerwear', inStock: true, image: 'puffer-plum.jpg' },
    { id: 2, name: 'FAUX SUEDE PUFFER STEEL', price: 230.00, category: 'outerwear', inStock: true, image: 'puffer-steel.jpg' },
    { id: 3, name: 'FAUX SUEDE PUFFER BLACK', price: 230.00, category: 'outerwear', inStock: true, image: 'puffer-black.jpg' },
    { id: 4, name: '56 FIELD JACKET CAMO', price: 160.00, category: 'outerwear', inStock: true, image: 'field-jacket-camo.jpg' },
    
    // Верх (Tops)
    { id: 5, name: 'B LOGO PUFF PRINT HOODIE BLUE', price: 100.00, category: 'tops', inStock: false, image: 'hoodie-blue.jpg' },
    { id: 6, name: 'B LOGO PUFF PRINT HOODIE BROWN', price: 100.00, category: 'tops', inStock: false, image: 'hoodie-brown.jpg' },
    { id: 7, name: 'ALWAYS HARD TEE BLACK', price: 34.00, category: 'tops', inStock: false, image: 'tee-hard-black.jpg' },
    { id: 8, name: 'OLD E SPIRAL TEE BLUE CAMO', price: 40.00, category: 'tops', inStock: true, image: 'tee-spiral-blue.jpg' },
    { id: 9, name: 'OLD E SPIRAL TEE CREAM', price: 34.00, category: 'tops', inStock: true, image: 'tee-spiral-cream.jpg' },
    { id: 10, name: 'OLD E SPIRAL TEE BLACK', price: 34.00, category: 'tops', inStock: true, image: 'tee-spiral-black.jpg' },
    { id: 11, name: 'BRONZE RADIO TEE BLUE', price: 34.00, category: 'tops', inStock: true, image: 'tee-radio-blue.jpg' },
    { id: 12, name: 'BRONZE RADIO TEE BLACK', price: 34.00, category: 'tops', inStock: false, image: 'tee-radio-black.jpg' },
    { id: 13, name: 'RANCH TEE BLACK', price: 34.00, category: 'tops', inStock: false, image: 'tee-ranch-black.jpg' },
    { id: 14, name: 'RANCH TEE WHITE', price: 34.00, category: 'tops', inStock: true, image: 'tee-ranch-white.jpg' },
    { id: 15, name: 'KEBAB TEE BLACK', price: 34.00, category: 'tops', inStock: true, image: 'tee-kebab-black.jpg' },
    { id: 16, name: 'KEBAB TEE WHITE', price: 34.00, category: 'tops', inStock: true, image: 'tee-kebab-white.jpg' },
    { id: 17, name: 'KEBAB TEE ORANGE', price: 34.00, category: 'tops', inStock: true, image: 'tee-kebab-orange.jpg' },
    
    // Низ (Bottoms)
    { id: 18, name: 'CARGO PANT BLACK', price: 110.00, category: 'bottoms', inStock: true, image: 'cargo-black.jpg' },
    { id: 19, name: 'CARGO PANT OLIVE', price: 110.00, category: 'bottoms', inStock: true, image: 'cargo-olive.jpg' },
    { id: 20, name: 'TECH FLEECE JOGGER', price: 95.00, category: 'bottoms', inStock: true, image: 'jogger-tech.jpg' },
    
    // Обувь (Footwear)
    { id: 21, name: 'RUNNER SNEAKER WHITE', price: 140.00, category: 'footwear', inStock: true, image: 'sneaker-white.jpg' },
    { id: 22, name: 'RUNNER SNEAKER BLACK', price: 140.00, category: 'footwear', inStock: true, image: 'sneaker-black.jpg' },
    
    // Аксессуары (Accessories)
    { id: 23, name: '5-PANEL HAT NAVY', price: 45.00, category: 'accessories', inStock: true, image: 'hat-navy.jpg' },
    { id: 24, name: 'CAMP CAP ORANGE', price: 40.00, category: 'accessories', inStock: true, image: 'cap-orange.jpg' },
    { id: 25, name: 'TRIBAL BEANIE BLACK', price: 35.00, category: 'accessories', inStock: true, image: 'beanie-black.jpg' },
    
    // Сумки (Bags)
    { id: 26, name: 'TOTE BAG CANVAS', price: 55.00, category: 'bags', inStock: true, image: 'tote-canvas.jpg' },
    { id: 27, name: 'BACKPACK BLACK', price: 89.00, category: 'bags', inStock: true, image: 'backpack-black.jpg' },
    
    // Ковры (Rugs)
    { id: 28, name: 'LOGO RUG BLACK', price: 120.00, category: 'rugs', inStock: true, image: 'rug-black.jpg' },
    { id: 29, name: 'TIE DYE RUG', price: 130.00, category: 'rugs', inStock: true, image: 'rug-tie-dye.jpg' }
];

const categories = [
    { id: 1, name: 'TOPS', slug: 'tops', icon: '👕' },
    { id: 2, name: 'BOTTOMS', slug: 'bottoms', icon: '👖' },
    { id: 3, name: 'FOOTWEAR', slug: 'footwear', icon: '👟' },
    { id: 4, name: 'ACCESSORIES', slug: 'accessories', icon: '🧢' },
    { id: 5, name: 'RUGS', slug: 'rugs', icon: '🪑' },
    { id: 6, name: 'BAGS', slug: 'bags', icon: '🎒' },
    { id: 7, name: 'OUTERWEAR', slug: 'outerwear', icon: '🧥' }
];

// ---------- КОРЗИНА (CART) ----------

// Получение корзины из localStorage
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('bronze56k_cart') || '[]');
    } catch (error) {
        console.error('Error loading cart:', error);
        return [];
    }
}

// Сохранение корзины
function saveCart(cart) {
    try {
        localStorage.setItem('bronze56k_cart', JSON.stringify(cart));
        updateCartCount();
        return true;
    } catch (error) {
        console.error('Error saving cart:', error);
        return false;
    }
}

// Обновление счетчика корзины
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    document.querySelectorAll('#cart-count').forEach(el => {
        if (el) el.textContent = totalItems;
    });
    
    return totalItems;
}

// Добавление товара в корзину
function addToCart(productId, quantity = 1, size = null) {
    const cart = getCart();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showNotification('Product not found', 'error');
        return false;
    }
    
    if (!product.inStock) {
        showNotification('This item is sold out', 'error');
        return false;
    }
    
    // Проверяем, есть ли товар уже в корзине (с учетом размера)
    const existingIndex = cart.findIndex(item => 
        item.id === productId && item.size === size
    );
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            size: size,
            quantity: quantity
        });
    }
    
    saveCart(cart);
    showNotification(`${product.name} added to sack`, 'success');
    
    // Анимация корзины
    animateCartIcon();
    
    return true;
}

// Удаление товара из корзины
function removeFromCart(index) {
    const cart = getCart();
    const removed = cart[index];
    cart.splice(index, 1);
    saveCart(cart);
    showNotification(`${removed.name} removed from sack`, 'info');
    return true;
}

// Обновление количества товара
function updateCartItemQuantity(index, quantity) {
    if (quantity < 1) return removeFromCart(index);
    
    const cart = getCart();
    cart[index].quantity = quantity;
    saveCart(cart);
    return true;
}

// Очистка корзины
function clearCart() {
    localStorage.removeItem('bronze56k_cart');
    updateCartCount();
    showNotification('Sack cleared', 'info');
}

// Получение общей суммы корзины
function getCartTotal() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 150 ? 0 : 10;
    
    return {
        subtotal: subtotal,
        shipping: shipping,
        total: subtotal + shipping
    };
}

// Анимация иконки корзины
function animateCartIcon() {
    const cartIcon = document.querySelector('a[href="cart.html"]');
    if (!cartIcon) return;
    
    cartIcon.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
    }, 200);
}

// ---------- УВЕДОМЛЕНИЯ ----------

function showNotification(message, type = 'success') {
    // Создаем контейнер для уведомлений, если его нет
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
        `;
        document.body.appendChild(container);
    }
    
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.style.cssText = `
        background: ${type === 'success' ? '#000' : '#ef4444'};
        color: white;
        padding: 12px 24px;
        margin-top: 10px;
        border: 1px solid ${type === 'success' ? '#000' : '#ef4444'};
        animation: slideIn 0.3s;
        font-size: 14px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        cursor: pointer;
    `;
    notification.textContent = message;
    
    // Добавляем в контейнер
    container.appendChild(notification);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
    
    // Клик для закрытия
    notification.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

// ---------- АВТОРИЗАЦИЯ ----------

// Проверка статуса авторизации
function isLoggedIn() {
    return localStorage.getItem('bronze56k_user') !== null;
}

// Получение данных пользователя
function getUser() {
    try {
        return JSON.parse(localStorage.getItem('bronze56k_user')) || null;
    } catch {
        return null;
    }
}

// Вход пользователя
function login(email, password) {
    // В демо-версии принимаем любые данные
    const user = {
        name: email.split('@')[0],
        email: email,
        phone: '',
        memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
    
    localStorage.setItem('bronze56k_user', JSON.stringify(user));
    showNotification('Signed in successfully', 'success');
    
    // Проверяем, есть ли редирект
    const redirect = sessionStorage.getItem('login_redirect');
    if (redirect) {
        sessionStorage.removeItem('login_redirect');
        window.location.href = redirect;
    } else {
        window.location.href = 'profile.html';
    }
}

// Регистрация пользователя
function register(name, email, password) {
    const user = {
        name: name,
        email: email,
        phone: '',
        memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
    
    localStorage.setItem('bronze56k_user', JSON.stringify(user));
    showNotification('Account created successfully', 'success');
    
    const redirect = sessionStorage.getItem('login_redirect');
    if (redirect) {
        sessionStorage.removeItem('login_redirect');
        window.location.href = redirect;
    } else {
        window.location.href = 'profile.html';
    }
}

// Выход из системы
function logout() {
    localStorage.removeItem('bronze56k_user');
    showNotification('Signed out successfully', 'info');
    
    // Если на странице профиля или заказов, перенаправляем
    if (window.location.pathname.includes('profile.html') || 
        window.location.pathname.includes('orders.html')) {
        window.location.href = 'index.html';
    }
}

// ---------- ЗАКАЗЫ ----------

// Создание заказа
function createOrder() {
    const cart = getCart();
    if (cart.length === 0) {
        showNotification('Your sack is empty', 'error');
        return null;
    }
    
    const totals = getCartTotal();
    
    const order = {
        id: 'ORD-' + Date.now().toString().slice(-6),
        date: new Date().toLocaleDateString('en-CA'),
        items: [...cart],
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        total: totals.total,
        status: 'processing',
        statusText: 'Processing',
        trackingNumber: 'TRK-' + Math.floor(Math.random() * 1000000)
    };
    
    // Сохраняем заказ
    const orders = JSON.parse(localStorage.getItem('bronze56k_orders') || '[]');
    orders.unshift(order);
    localStorage.setItem('bronze56k_orders', JSON.stringify(orders));
    
    // Очищаем корзину
    clearCart();
    
    showNotification('Order placed successfully!', 'success');
    return order;
}

// Получение заказов пользователя
function getUserOrders() {
    return JSON.parse(localStorage.getItem('bronze56k_orders') || '[]');
}

// Получение заказа по ID
function getOrderById(orderId) {
    const orders = getUserOrders();
    return orders.find(o => o.id === orderId) || null;
}

// Повтор заказа
function reorder(orderId) {
    const order = getOrderById(orderId);
    if (!order) {
        showNotification('Order not found', 'error');
        return false;
    }
    
    order.items.forEach(item => {
        addToCart(item.id, item.quantity, item.size);
    });
    
    showNotification('Items added to your sack', 'success');
    return true;
}

// ---------- ИЗБРАННОЕ (WISHLIST) ----------

function getWishlist() {
    return JSON.parse(localStorage.getItem('bronze56k_wishlist') || '[]');
}

function saveWishlist(wishlist) {
    localStorage.setItem('bronze56k_wishlist', JSON.stringify(wishlist));
}

function toggleWishlist(productId) {
    const wishlist = getWishlist();
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('Removed from wishlist', 'info');
    } else {
        wishlist.push(productId);
        showNotification('Added to wishlist', 'success');
    }
    
    saveWishlist(wishlist);
    return wishlist;
}

function isInWishlist(productId) {
    const wishlist = getWishlist();
    return wishlist.includes(productId);
}

// ---------- АДРЕСА ----------

function getAddresses() {
    return JSON.parse(localStorage.getItem('bronze56k_addresses') || '[]');
}

function saveAddresses(addresses) {
    localStorage.setItem('bronze56k_addresses', JSON.stringify(addresses));
}

function addAddress(address) {
    const addresses = getAddresses();
    address.id = Date.now();
    
    if (addresses.length === 0) {
        address.isDefault = true;
    }
    
    addresses.push(address);
    saveAddresses(addresses);
    showNotification('Address added', 'success');
    return addresses;
}

function deleteAddress(addressId) {
    let addresses = getAddresses();
    addresses = addresses.filter(a => a.id !== addressId);
    
    // Если удалили дефолтный, делаем первый дефолтным
    if (addresses.length > 0 && !addresses.some(a => a.isDefault)) {
        addresses[0].isDefault = true;
    }
    
    saveAddresses(addresses);
    showNotification('Address deleted', 'info');
    return addresses;
}

function setDefaultAddress(addressId) {
    const addresses = getAddresses();
    addresses.forEach(addr => {
        addr.isDefault = (addr.id === addressId);
    });
    saveAddresses(addresses);
    showNotification('Default address updated', 'success');
    return addresses;
}

// ---------- ПОИСК И ФИЛЬТРАЦИЯ ----------

function searchProducts(query) {
    if (!query) return [];
    
    const lowerQuery = query.toLowerCase();
    return products.filter(product => 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
    );
}

function filterProducts(category, inStockOnly = false, minPrice = 0, maxPrice = 1000) {
    let filtered = products;
    
    if (category && category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }
    
    if (inStockOnly) {
        filtered = filtered.filter(p => p.inStock);
    }
    
    filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);
    
    return filtered;
}

function sortProducts(productsArray, sortBy = 'name', order = 'asc') {
    const sorted = [...productsArray];
    
    sorted.sort((a, b) => {
        let valA, valB;
        
        switch(sortBy) {
            case 'price':
                valA = a.price;
                valB = b.price;
                break;
            case 'name':
            default:
                valA = a.name;
                valB = b.name;
        }
        
        if (order === 'asc') {
            return valA > valB ? 1 : -1;
        } else {
            return valA < valB ? 1 : -1;
        }
    });
    
    return sorted;
}

// ---------- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ----------

// Форматирование цены
function formatPrice(price) {
    return '$' + price.toFixed(2);
}

// Получение товара по ID
function getProductById(id) {
    return products.find(p => p.id === id) || null;
}

// Получение товаров по категории
function getProductsByCategory(category) {
    return products.filter(p => p.category === category);
}

// Получение популярных товаров (для демо)
function getFeaturedProducts(limit = 4) {
    return products.filter(p => p.inStock).slice(0, limit);
}

// Получение новинок (для демо)
function getNewArrivals(limit = 9) {
    return products.slice(-limit);
}

// ---------- ИНИЦИАЛИЗАЦИЯ ----------

document.addEventListener('DOMContentLoaded', function() {
    // Обновляем счетчик корзины
    updateCartCount();
    
    // Добавляем стили для анимаций, если их нет
    if (!document.getElementById('animation-styles')) {
        const styles = document.createElement('style');
        styles.id = 'animation-styles';
        styles.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            .quick-add {
                position: absolute;
                bottom: 10px;
                right: 10px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: #000;
                color: #fff;
                border: none;
                font-size: 20px;
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.2s, transform 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10;
            }
            
            .product-card:hover .quick-add {
                opacity: 1;
            }
            
            .quick-add:hover {
                transform: scale(1.1);
            }
        `;
        document.head.appendChild(styles);
    }
});

// ---------- ЭКСПОРТ ДЛЯ ИСПОЛЬЗОВАНИЯ В ДРУГИХ ФАЙЛАХ ----------
// (функции доступны глобально)
window.Bronze56k = {
    // Корзина
    getCart,
    saveCart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getCartTotal,
    
    // Авторизация
    isLoggedIn,
    getUser,
    login,
    register,
    logout,
    
    // Заказы
    createOrder,
    getUserOrders,
    getOrderById,
    reorder,
    
    // Избранное
    getWishlist,
    toggleWishlist,
    isInWishlist,
    
    // Адреса
    getAddresses,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    
    // Товары
    getProductById,
    getProductsByCategory,
    getFeaturedProducts,
    getNewArrivals,
    searchProducts,
    filterProducts,
    sortProducts,
    
    // Утилиты
    formatPrice,
    showNotification
};