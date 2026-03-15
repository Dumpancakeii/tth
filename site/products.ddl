CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price_usd DECIMAL(10, 2) NOT NULL, -- цена в долларах (исходная)
    price_rub DECIMAL(10, 2) NOT NULL, -- цена в рублях (конвертированная)
    compare_at_price DECIMAL(10, 2), -- старая цена для скидки
    cost_price DECIMAL(10, 2), -- себестоимость
    sku VARCHAR(100) UNIQUE, -- артикул
    barcode VARCHAR(100), -- штрихкод
    quantity INTEGER DEFAULT 0, -- общее количество
    reserved_quantity INTEGER DEFAULT 0, -- зарезервировано в заказах
    available_quantity INTEGER GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
    weight_kg DECIMAL(8, 2), -- вес в кг
    dimensions_cm JSONB, -- габариты {length, width, height}
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT true,
    views_count INTEGER DEFAULT 0,
    sold_count INTEGER DEFAULT 0,
    rating_avg DECIMAL(3, 2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_price ON products(price_rub);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_is_new ON products(is_new);
CREATE FULLTEXT INDEX idx_products_search ON products(name, description);