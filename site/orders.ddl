CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled, refunded
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed, refunded
    shipping_status VARCHAR(50) DEFAULT 'pending', -- pending, processing, shipped, delivered
    subtotal DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    shipping_amount DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'RUB',
    
    -- Информация о доставке
    shipping_address_id INTEGER REFERENCES addresses(id),
    shipping_method VARCHAR(100),
    tracking_number VARCHAR(100),
    delivery_date DATE,
    
    -- Информация об оплате
    payment_method VARCHAR(100),
    payment_id VARCHAR(255), -- ID транзакции в платежной системе
    paid_at TIMESTAMP,
    
    -- Детали
    notes TEXT,
    admin_notes TEXT,
    
    -- Временные метки
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP
);

-- Индексы
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at);