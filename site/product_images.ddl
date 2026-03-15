CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    variant_id INTEGER REFERENCES product_variants(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_url_thumb TEXT,
    sort_order INTEGER DEFAULT 0,
    is_main BOOLEAN DEFAULT false,
    alt_text VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_images_product_id ON product_images(product_id);
CREATE INDEX idx_images_variant_id ON product_images(variant_id);