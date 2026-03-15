CREATE TABLE product_variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE,
    size VARCHAR(50), -- S, M, L, XL, etc
    color VARCHAR(50), -- Black, White, etc
    color_code VARCHAR(20), -- HEX код цвета
    price_adjustment DECIMAL(10, 2) DEFAULT 0, -- наценка/скидка для варианта
    quantity INTEGER DEFAULT 0,
    reserved_quantity INTEGER DEFAULT 0,
    available_quantity INTEGER GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
    image_url TEXT, -- специфичное для варианта изображение
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku);