// cart-sync.js - Ядро синхронизации корзины для всех страниц

// ============================================
// 1. ЕДИНОЕ ХРАНИЛИЩЕ СОСТОЯНИЯ
// ============================================

const CartSync = {
    // Текущее состояние корзины
    state: {
        items: [],
        lastUpdate: null,
        listeners: []
    },
    
    // Инициализация
    init() {
        this.loadFromStorage();
        this.setupAutoSync();
        this.setupCrossTabSync();
        console.log('CartSync initialized');
    },
    
    // Загрузка из localStorage
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('tth_cart');
            this.state.items = saved ? JSON.parse(saved) : [];
            this.state.lastUpdate = Date.now();
        } catch (e) {
            console.error('Error loading cart:', e);
            this.state.items = [];
        }
    },
    
    // Сохранение в localStorage
    saveToStorage() {
        try {
            localStorage.setItem('tth_cart', JSON.stringify(this.state.items));
            this.state.lastUpdate = Date.now();
            this.notifyListeners();
        } catch (e) {
            console.error('Error saving cart:', e);
        }
    }
};

// ============================================
// 2. СИСТЕМА СОБЫТИЙ - уведомление всех компонентов
// ============================================

Object.assign(CartSync, {
    // Подписка на изменения
    subscribe(callback) {
        this.state.listeners.push(callback);
        // Сразу вызываем с текущим состоянием
        callback(this.state.items);
        return () => this.unsubscribe(callback);
    },
    
    // Отписка
    unsubscribe(callback) {
        this.state.listeners = this.state.listeners.filter(cb => cb !== callback);
    },
    
    // Уведомление всех подписчиков
    notifyListeners() {
        this.state.listeners.forEach(callback => {
            try {
                callback(this.state.items);
            } catch (e) {
                console.error('Error in listener:', e);
            }
        });
    }
});

// ============================================
// 3. МЕТОДЫ УПРАВЛЕНИЯ КОРЗИНОЙ
// ============================================

Object.assign(CartSync, {
    // Получить все товары
    getItems() {
        return [...this.state.items];
    },
    
    // Получить количество товаров
    getTotalCount() {
        return this.state.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    },
    
    // Получить общую сумму
    getTotalSum() {
        return this.state.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    },
    
    // Добавить товар
    addItem(product, quantity = 1, options = {}) {
        const { size = null, color = null } = options;
        
        // Проверяем, есть ли уже такой товар (с такими же опциями)
        const existingIndex = this.state.items.findIndex(item => 
            item.id === product.id && 
            item.size === size && 
            item.color === color
        );
        
        if (existingIndex > -1) {
            // Увеличиваем количество
            this.state.items[existingIndex].quantity += quantity;
        } else {
            // Добавляем новый
            this.state.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity,
                size: size,
                color: color,
                addedAt: Date.now()
            });
        }
        
        this.saveToStorage();
        this.triggerVisualFeedback('added', product.name);
        return true;
    },
    
    // Обновить количество
    updateQuantity(index, quantity) {
        if (quantity < 1) {
            return this.removeItem(index);
        }
        
        if (index >= 0 && index < this.state.items.length) {
            this.state.items[index].quantity = quantity;
            this.saveToStorage();
            return true;
        }
        return false;
    },
    
    // Удалить товар
    removeItem(index) {
        if (index >= 0 && index < this.state.items.length) {
            const removed = this.state.items[index];
            this.state.items.splice(index, 1);
            this.saveToStorage();
            this.triggerVisualFeedback('removed', removed.name);
            return true;
        }
        return false;
    },
    
    // Очистить корзину
    clear() {
        this.state.items = [];
        this.saveToStorage();
        this.triggerVisualFeedback('cleared');
    },
    
    // Проверить, есть ли товар в корзине
    hasItem(productId, options = {}) {
        return this.state.items.some(item => 
            item.id === productId && 
            item.size === options.size && 
            item.color === options.color
        );
    },
    
    // Получить количество конкретного товара
    getItemQuantity(productId, options = {}) {
        const item = this.state.items.find(item => 
            item.id === productId && 
            item.size === options.size && 
            item.color === options.color
        );
        return item ? item.quantity : 0;
    }
});

// ============================================
// 4. ВИЗУАЛЬНАЯ ОБРАТНАЯ СВЯЗЬ
// ============================================

Object.assign(CartSync, {
    triggerVisualFeedback(action, productName = '') {
        // Анимация иконки корзины
        this.animateCartIcon();
        
        // Показываем уведомление
        const messages = {
            added: `✓ ${productName} добавлен в корзину`,
            removed: `✗ ${productName} удален из корзины`,
            cleared: 'Корзина очищена'
        };
        
        if (messages[action]) {
            this.showNotification(messages[action]);
        }
    },
    
    animateCartIcon() {
        const cartIcon = document.querySelector('a[href="cart.html"], .cart-icon, [data-cart]');
        if (cartIcon) {
            cartIcon.style.transform = 'scale(1.2)';
            cartIcon.style.transition = 'transform 0.2s';
            setTimeout(() => {
                cartIcon.style.transform = 'scale(1)';
            }, 200);
        }
    },
    
    showNotification(message) {
        // Используем существующую систему уведомлений из script.js
        if (window.showNotification) {
            window.showNotification(message, 'success');
        } else {
            // Резервный вариант
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #000;
                color: #fff;
                padding: 12px 24px;
                z-index: 9999;
                animation: slideIn 0.3s;
                font-size: 14px;
                cursor: pointer;
            `;
            notification.textContent = message;
            notification.onclick = () => notification.remove();
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        }
    }
});

// ============================================
// 5. СИНХРОНИЗАЦИЯ МЕЖДУ ВКЛАДКАМИ
// ============================================

Object.assign(CartSync, {
    setupCrossTabSync() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'tth_cart') {
                const oldItems = this.state.items;
                this.loadFromStorage();
                
                // Проверяем, изменилось ли что-то
                if (JSON.stringify(oldItems) !== JSON.stringify(this.state.items)) {
                    this.notifyListeners();
                    this.animateCartIcon();
                }
            }
        });
    },
    
    // Автоматическая синхронизация с сервером (если есть бэкенд)
    setupAutoSync() {
        // Каждые 30 секунд проверяем актуальность
        setInterval(() => {
            this.syncWithServer();
        }, 30000);
    },
    
    async syncWithServer() {
        // Если есть API, синхронизируем с сервером
        if (window.isLoggedIn && window.isLoggedIn()) {
            try {
                // Здесь будет запрос к серверу
                console.log('Auto-syncing with server...');
            } catch (e) {
                console.error('Sync failed:', e);
            }
        }
    }
});

// ============================================
// 6. АПИ ДЛЯ ИСПОЛЬЗОВАНИЯ В КОМПОНЕНТАХ
// ============================================

// Делаем доступным глобально
window.CartSync = CartSync;

// Инициализируем при загрузке
document.addEventListener('DOMContentLoaded', () => {
    CartSync.init();
    
    // Обновляем все счётчики на странице
    CartSync.subscribe((items) => {
        document.querySelectorAll('.cart-count, #cart-count, [data-cart-count]').forEach(el => {
            const count = items.reduce((sum, item) => sum + item.quantity, 0);
            el.textContent = count;
            
            // Скрываем/показываем в зависимости от наличия товаров
            if (count === 0) {
                el.style.display = 'none';
            } else {
                el.style.display = 'inline';
            }
        });
    });
});

// ============================================
// 7. ДЕКОРАТОРЫ ДЛЯ КАРТОЧЕК ТОВАРОВ
// ============================================

// Класс для создания интерактивных карточек товаров
class ProductCardController {
    constructor(cardElement, productId) {
        this.card = cardElement;
        this.productId = productId;
        this.product = null;
        
        this.init();
    }
    
    async init() {
        // Получаем данные о товаре
        this.product = window.getProductById ? window.getProductById(this.productId) : null;
        
        if (!this.product) return;
        
        // Создаем UI
        this.createQuickAddButton();
        this.addSizeSelector();
        this.setupSubscription();
    }
    
    createQuickAddButton() {
        const btn = document.createElement('button');
        btn.className = 'quick-add-btn';
        btn.innerHTML = '+';
        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.quickAdd();
        };
        this.card.appendChild(btn);
    }
    
    addSizeSelector() {
        // Если у товара есть размеры, добавляем селектор
        if (this.product.hasSizes) {
            const selector = document.createElement('div');
            selector.className = 'size-selector-mini';
            selector.innerHTML = `
                <select onchange="event.stopPropagation()">
                    <option>S</option>
                    <option>M</option>
                    <option>L</option>
                    <option>XL</option>
                </select>
            `;
            this.card.appendChild(selector);
        }
    }
    
    setupSubscription() {
        // Подписываемся на изменения корзины
        CartSync.subscribe((items) => {
            const inCart = items.some(item => item.id === this.productId);
            this.updateButtonState(inCart);
        });
    }
    
    quickAdd() {
        if (this.product) {
            CartSync.addItem(this.product, 1);
            
            // Анимация кнопки
            const btn = this.card.querySelector('.quick-add-btn');
            btn.innerHTML = '✓';
            btn.style.background = '#22c55e';
            setTimeout(() => {
                btn.innerHTML = '+';
                btn.style.background = '';
            }, 1000);
        }
    }
    
    updateButtonState(inCart) {
        const btn = this.card.querySelector('.quick-add-btn');
        if (btn) {
            if (inCart) {
                btn.innerHTML = '✓';
                btn.title = 'В корзине';
            } else {
                btn.innerHTML = '+';
                btn.title = 'Добавить в корзину';
            }
        }
    }
}

// Автоматически применяем ко всем карточкам товаров
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.product-card').forEach((card, index) => {
        const link = card.querySelector('a[href*="product.html?id="]') || card;
        const match = link.href?.match(/id=(\d+)/);
        if (match) {
            new ProductCardController(card, parseInt(match[1]));
        }
    });
});

// ============================================
// 8. КОМПОНЕНТ КОРЗИНЫ В ШАПКЕ
// ============================================

class CartHeaderComponent {
    constructor() {
        this.element = document.querySelector('.cart-header, [data-cart-header]');
        if (!this.element) return;
        
        this.init();
    }
    
    init() {
        // Подписываемся на изменения
        CartSync.subscribe((items) => {
            this.update(items);
        });
        
        // Добавляем превью корзины при наведении
        this.setupPreview();
    }
    
    update(items) {
        const count = items.reduce((sum, item) => sum + item.quantity, 0);
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Обновляем счетчик
        const countEl = this.element.querySelector('.cart-count');
        if (countEl) {
            countEl.textContent = count;
        }
        
        // Обновляем сумму (если есть)
        const totalEl = this.element.querySelector('.cart-total');
        if (totalEl) {
            totalEl.textContent = `₽${total}`;
        }
        
        // Показываем/скрываем индикатор
        const indicator = this.element.querySelector('.cart-indicator');
        if (indicator) {
            if (count > 0) {
                indicator.style.display = 'block';
            } else {
                indicator.style.display = 'none';
            }
        }
    }
    
    setupPreview() {
        let previewTimeout;
        
        this.element.addEventListener('mouseenter', () => {
            clearTimeout(previewTimeout);
            this.showPreview();
        });
        
        this.element.addEventListener('mouseleave', () => {
            previewTimeout = setTimeout(() => {
                this.hidePreview();
            }, 300);
        });
    }
    
    showPreview() {
        const items = CartSync.getItems();
        if (items.length === 0) return;
        
        let preview = document.querySelector('.cart-preview');
        if (!preview) {
            preview = document.createElement('div');
            preview.className = 'cart-preview';
            document.body.appendChild(preview);
        }
        
        // Создаем HTML для превью
        const itemsHtml = items.slice(0, 3).map(item => `
            <div class="preview-item">
                <img src="https://via.placeholder.com/40x50" alt="${item.name}">
                <div>
                    <div>${item.name.substring(0, 20)}...</div>
                    <div>${item.quantity} x ₽${item.price}</div>
                </div>
            </div>
        `).join('');
        
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const moreCount = items.length - 3;
        
        preview.innerHTML = `
            <div class="preview-header">Корзина (${items.length})</div>
            ${itemsHtml}
            ${moreCount > 0 ? `<div class="preview-more">и ещё ${moreCount} товаров</div>` : ''}
            <div class="preview-total">Итого: ₽${total}</div>
            <a href="cart.html" class="preview-btn">Перейти в корзину</a>
        `;
        
        // Позиционируем
        const rect = this.element.getBoundingClientRect();
        preview.style.top = rect.bottom + 'px';
        preview.style.right = (window.innerWidth - rect.right) + 'px';
        preview.style.display = 'block';
    }
    
    hidePreview() {
        const preview = document.querySelector('.cart-preview');
        if (preview) {
            preview.style.display = 'none';
        }
    }
}

// Стили для превью
const style = document.createElement('style');
style.textContent = `
    .cart-preview {
        position: fixed;
        background: white;
        border: 1px solid #e5e5e5;
        width: 300px;
        padding: 15px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        z-index: 1000;
        display: none;
    }
    
    .preview-header {
        font-weight: 600;
        padding-bottom: 10px;
        border-bottom: 1px solid #e5e5e5;
        margin-bottom: 10px;
    }
    
    .preview-item {
        display: flex;
        gap: 10px;
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;
    }
    
    .preview-item img {
        width: 40px;
        height: 50px;
        object-fit: cover;
    }
    
    .preview-more {
        text-align: center;
        padding: 8px;
        color: #888;
        font-size: 12px;
    }
    
    .preview-total {
        font-weight: 700;
        text-align: right;
        margin: 15px 0 10px;
        padding-top: 10px;
        border-top: 1px solid #e5e5e5;
    }
    
    .preview-btn {
        display: block;
        text-align: center;
        padding: 10px;
        background: #000;
        color: white;
        text-decoration: none;
        font-size: 13px;
        font-weight: 500;
    }
    
    .preview-btn:hover {
        opacity: 0.8;
    }
    
    .quick-add-btn {
        position: absolute;
        bottom: 10px;
        right: 10px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #000;
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
        z-index: 10;
    }
    
    .product-card:hover .quick-add-btn {
        opacity: 1;
    }
    
    .size-selector-mini {
        position: absolute;
        bottom: 60px;
        right: 10px;
        display: none;
    }
    
    .product-card:hover .size-selector-mini {
        display: block;
    }
    
    .cart-indicator {
        display: none;
        position: absolute;
        top: -5px;
        right: -5px;
        width: 8px;
        height: 8px;
        background: #22c55e;
        border-radius: 50%;
    }
    
    .cart-header {
        position: relative;
    }
`;

document.head.appendChild(style);

// Инициализируем компоненты
document.addEventListener('DOMContentLoaded', () => {
    new CartHeaderComponent();
});

// Экспортируем для использования
window.ProductCardController = ProductCardController;
window.CartHeaderComponent = CartHeaderComponent;