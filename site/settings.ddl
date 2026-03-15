CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Примеры настроек
INSERT INTO settings (key, value) VALUES 
('store_info', '{"name":"BRONZE56K","email":"info@bronze56k.com","phone":"+79991234567"}'),
('shipping', '{"free_threshold_rub":10000,"standard_rate":500,"express_rate":1000}'),
('seo', '{"title":"BRONZE56K Streetwear","description":"Streetwear for the underground"}'),
('social', '{"instagram":"bronze56k","telegram":"bronze56k"}');