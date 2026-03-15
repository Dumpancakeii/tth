CREATE TABLE promotions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL, -- fixed_amount, percentage, free_shipping
    value DECIMAL(10, 2), -- сумма или процент
    min_order_amount DECIMAL(10, 2),
    usage_limit INTEGER, -- максимальное количество использований
    used_count INTEGER DEFAULT 0,
    applies_to VARCHAR(50), -- all, category, product
    applies_to_ids JSONB, -- [1,2,3] - ID категорий или товаров
    starts_at TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_promotions_code ON promotions(code);
CREATE INDEX idx_promotions_dates ON promotions(starts_at, expires_at);