CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    session_id VARCHAR(255), -- для неавторизованных пользователей
    items JSONB NOT NULL DEFAULT '[]', -- [{product_id, variant_id, quantity, price, name}]
    subtotal DECIMAL(10, 2) DEFAULT 0,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cart_user_id ON cart(user_id);
CREATE INDEX idx_cart_session_id ON cart(session_id);