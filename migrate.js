// migrate.js — Create tables and seed products into SQLite
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    old_price TEXT DEFAULT '',
    color TEXT DEFAULT '',
    category TEXT DEFAULT '',
    tag TEXT DEFAULT '',
    sold_out INTEGER DEFAULT 0,
    sku TEXT DEFAULT '',
    data_id TEXT UNIQUE,
    images TEXT DEFAULT '[]',
    sizes TEXT DEFAULT '[]',
    description TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    page TEXT DEFAULT '',
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS newsletters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    sent_to INTEGER DEFAULT 0,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT DEFAULT ''
  );
`);

// Default settings
const defaults = { smtp_host:'smtp.gmail.com', smtp_port:'587', smtp_user:'', smtp_pass:'', smtp_from:'TrustTheHood <noreply@trustthehood.ru>', admin_password:'admin123' };
const insSetting = db.prepare('INSERT OR IGNORE INTO settings (key,value) VALUES (?,?)');
for (const [k,v] of Object.entries(defaults)) insSetting.run(k,v);

// Product data (extracted from original shop.html)
const products = [
  { name:"Брюки CODERED Ultrawide Summer", price:"7 200", color:"gray", category:"низ", data_id:"pants-codered", sku:"TTH-PNTS-CDRED", images:["assets/images/codered-pants-1.jpg","assets/images/codered-pants-2.jpg","assets/images/codered-pants-3.jpg"] },
  { name:"Бомбер HJELP", price:"12 000", color:"green", category:"верх", data_id:"bomber-hjelp1", sku:"TTH-BMBR-HJLP1", images:["assets/images/bomber-hjelp-1.jpg","assets/images/bomber-hjelp-2.jpg","assets/images/bomber-hjelp-3.jpg","assets/images/bomber-hjelp-4.jpg"] },
  { name:"Salomon XT-6 Expanse", price:"18 000", color:"white", category:"обувь", data_id:"salomon-xt6", sku:"TTH-SLMN-XT6", images:["assets/images/salomon-xt6-1.jpg","assets/images/salomon-xt6-2.jpg","assets/images/salomon-xt6-3.jpg","assets/images/salomon-xt6-4.jpg"] },
  { name:"Кепка CP Company x Adidas", price:"6 500", color:"black", category:"аксессуары", data_id:"cap-cp-adidas", sku:"TTH-CAP-CPAD", images:["assets/images/cap-cp-adidas-1.jpg","assets/images/cap-cp-adidas-2.jpg","assets/images/cap-cp-adidas-3.jpg"] },
  { name:"Брюки Dickies Double Knee", price:"8 500", color:"brown", category:"низ", data_id:"pants-dickies-double-knee", sku:"TTH-PNTS-DCKN", images:["assets/images/dickies-double-knee-1.jpg","assets/images/dickies-double-knee-2.jpg","assets/images/dickies-double-knee-3.jpg"] },
  { name:"Брюки HJELP Baggy", price:"6 000", color:"black", category:"низ", data_id:"pants-hjelp-baggy", sku:"TTH-PNTS-HJBG", images:["assets/images/hjelp-baggy-1.jpg","assets/images/hjelp-baggy-2.jpg","assets/images/hjelp-baggy-3.jpg"] },
  { name:"Джинсы Carhartt B13", price:"9 500", color:"blue", category:"низ", data_id:"jeans-carhartt-b13", sku:"TTH-JNS-CHB13", images:["assets/images/carhartt-b13-1.jpg","assets/images/carhartt-b13-2.jpg","assets/images/carhartt-b13-3.jpg"] },
  { name:"Джинсы РАССВЕТ", price:"12 000", old_price:"15 000", color:"blue", category:"низ", tag:"sale", data_id:"jeans-rassvet", sku:"TTH-JNS-RSVT", images:["assets/images/rassvet-jeans-1.jpg","assets/images/rassvet-jeans-2.jpg","assets/images/rassvet-jeans-3.jpg"] },
  { name:"Джинсы OKTYABR Baggy", price:"7 000", color:"black", category:"низ", data_id:"jeans-oktyabr-baggy", sku:"TTH-JNS-OKBG", images:["assets/images/oktyabr-baggy-1.jpg","assets/images/oktyabr-baggy-2.jpg","assets/images/oktyabr-baggy-3.jpg"] },
  { name:"Куртка HJELP Rain", price:"9 000", color:"black", category:"верх", data_id:"jacket-hjelp-rain", sku:"TTH-JKT-HJRN", images:["assets/images/hjelp-rain-1.jpg","assets/images/hjelp-rain-2.jpg","assets/images/hjelp-rain-3.jpg"] },
  { name:"Ковёр Bitch", price:"5 500", color:"pattern", category:"ковры", data_id:"rug-bitch", sku:"TTH-RUG-BTCH", images:["assets/images/rug-bitch-1.jpg","assets/images/rug-bitch-2.jpg"] },
  { name:"Футболка CODERED Dacar", price:"3 500", color:"black", category:"верх", data_id:"tshirt-codered-dacar", sku:"TTH-TSR-CRDC", images:["assets/images/codered-dacar-1.jpg","assets/images/codered-dacar-2.jpg","assets/images/codered-dacar-3.jpg"] },
  { name:"Футболка CODERED Paint Tune", price:"3 500", color:"white", category:"верх", data_id:"tshirt-codered-paint-tune", sku:"TTH-TSR-CRPT", images:["assets/images/codered-paint-tune-1.jpg","assets/images/codered-paint-tune-2.jpg","assets/images/codered-paint-tune-3.jpg"] },
  { name:"Футболка CODERED Crumped Box", price:"3 500", color:"black", category:"верх", data_id:"tshirt-codered-crumped-box", sku:"TTH-TSR-CRCB", images:["assets/images/codered-crumped-box-1.jpg","assets/images/codered-crumped-box-2.jpg","assets/images/codered-crumped-box-3.jpg"] },
  { name:"Футболка CODERED Кусок Green", price:"3 500", color:"green", category:"верх", data_id:"tshirt-codered-kusok-green", sku:"TTH-TSR-CRKG", images:["assets/images/codered-kusok-green-1.jpg","assets/images/codered-kusok-green-2.jpg","assets/images/codered-kusok-green-3.jpg"] },
  { name:"Футболка CODERED Кусок Black", price:"3 500", color:"black", category:"верх", data_id:"tshirt-codered-kusok-black", sku:"TTH-TSR-CRKB", images:["assets/images/codered-kusok-black-1.jpg","assets/images/codered-kusok-black-2.jpg","assets/images/codered-kusok-black-3.jpg"] },
  { name:"Футболка CODERED Logo20 Black", price:"3 200", color:"black", category:"верх", data_id:"tshirt-codered-logo20-black", sku:"TTH-TSR-CRLB", images:["assets/images/codered-logo20-black-1.jpg","assets/images/codered-logo20-black-2.jpg","assets/images/codered-logo20-black-3.jpg"] },
  { name:"Футболка CODERED Logo20 Blue", price:"3 200", color:"blue", category:"верх", data_id:"tshirt-codered-logo20-blue", sku:"TTH-TSR-CRLU", images:["assets/images/codered-logo20-blue-1.jpg","assets/images/codered-logo20-blue-2.jpg","assets/images/codered-logo20-blue-3.jpg"] },
  { name:"Худи CODERED Outline Logo 22", price:"7 500", color:"black", category:"верх", data_id:"hoodie-codered-outline-logo-22", sku:"TTH-HDC-CROL", images:["assets/images/codered-outline-logo-1.jpg","assets/images/codered-outline-logo-2.jpg","assets/images/codered-outline-logo-3.jpg"] },
  { name:"Худи CODERED Rolluppers", price:"7 500", color:"black", category:"верх", data_id:"hoodie-codered-rolluppers", sku:"TTH-HDC-CRRP", images:["assets/images/codered-rolluppers-1.jpg","assets/images/codered-rolluppers-2.jpg","assets/images/codered-rolluppers-3.jpg"] },
  { name:"Лонгслив CODERED Puzir Black", price:"4 500", color:"black", category:"верх", data_id:"longsleeve-codered-puzir-black", sku:"TTH-LSL-CRPB", images:["assets/images/codered-puzir-black-1.jpg","assets/images/codered-puzir-black-2.jpg","assets/images/codered-puzir-black-3.jpg"] },
  { name:"Худи CODERED Piping Font", price:"8 000", color:"black", category:"верх", data_id:"hoodie-codered-piping-font", sku:"TTH-HDC-CRPF", images:["assets/images/codered-piping-font-1.jpg","assets/images/codered-piping-font-2.jpg","assets/images/codered-piping-font-3.jpg"] },
  { name:"Лонгслив CODERED Puzir Gray", price:"4 500", color:"gray", category:"верх", data_id:"longsleeve-codered-puzir-gray", sku:"TTH-LSL-CRPG", images:["assets/images/codered-puzir-gray-1.jpg","assets/images/codered-puzir-gray-2.jpg","assets/images/codered-puzir-gray-3.jpg"] },
  { name:"Худи CODERED Logo30 TM", price:"7 000", color:"black", category:"верх", data_id:"hoodie-codered-logo30-tm", sku:"TTH-HDC-CRL3", images:["assets/images/codered-logo30-tm-1.jpg","assets/images/codered-logo30-tm-2.jpg","assets/images/codered-logo30-tm-3.jpg"] },
  { name:"Пенал CODERED Gray", price:"1 500", color:"gray", category:"аксессуары", data_id:"pencil-case-codered-gray", sku:"TTH-PNC-CRGR", images:["assets/images/pencil-case-gray-1.jpg","assets/images/pencil-case-gray-2.jpg"] },
  { name:"Пенал CODERED Blue", price:"1 500", color:"blue", category:"аксессуары", data_id:"pencil-case-codered-blue", sku:"TTH-PNC-CRBU", images:["assets/images/pencil-case-blue-1.jpg","assets/images/pencil-case-blue-2.jpg"] },
  { name:"Пенал CODERED Black", price:"1 500", color:"black", category:"аксессуары", data_id:"pencil-case-codered-black", sku:"TTH-PNC-CRBK", images:["assets/images/pencil-case-black-1.jpg","assets/images/pencil-case-black-2.jpg"] },
  { name:"Шапка CODERED Logo Contour Black", price:"2 500", color:"black", category:"аксессуары", data_id:"hat-codered-logo-contour-black", sku:"TTH-HAT-CRLC", images:["assets/images/hat-codered-contour-black-1.jpg","assets/images/hat-codered-contour-black-2.jpg"] },
  { name:"Шапка CODERED Rib Mix Short White", price:"2 500", color:"white", category:"аксессуары", data_id:"hat-codered-rib-mix-short-white", sku:"TTH-HAT-CRRM", images:["assets/images/hat-codered-rib-mix-1.jpg","assets/images/hat-codered-rib-mix-2.jpg"] },
  { name:"Худи NB TNT Gray", price:"9 000", color:"gray", category:"верх", data_id:"hoodie-nb-tnt-gray", sku:"TTH-HDH-NBTG", images:["assets/images/nb-tnt-gray-1.jpg","assets/images/nb-tnt-gray-2.jpg","assets/images/nb-tnt-gray-3.jpg"] },
  { name:"Худи NB TNT Black", price:"9 000", color:"black", category:"верх", data_id:"hoodie-nb-tnt-black", sku:"TTH-HDH-NBTB", images:["assets/images/nb-tnt-black-1.jpg","assets/images/nb-tnt-black-2.jpg","assets/images/nb-tnt-black-3.jpg"] },
  { name:"Брюки BBC Lining Black", price:"8 000", color:"black", category:"низ", data_id:"pants-bbc-lining-black", sku:"TTH-PNT-BBCB", images:["assets/images/bbc-lining-pants-1.jpg","assets/images/bbc-lining-pants-2.jpg","assets/images/bbc-lining-pants-3.jpg"] },
  { name:"Худи BBC Lining White", price:"9 500", color:"white", category:"верх", data_id:"hoodie-bbc-lining-white", sku:"TTH-HDH-BBCW", images:["assets/images/bbc-lining-white-1.jpg","assets/images/bbc-lining-white-2.jpg","assets/images/bbc-lining-white-3.jpg"] },
  { name:"Zip Худи Pleasures", price:"11 000", color:"black", category:"верх", data_id:"zip-hoodie-pleasures", sku:"TTH-ZHP-PLRS", images:["assets/images/pleasures-zip-1.jpg","assets/images/pleasures-zip-2.jpg","assets/images/pleasures-zip-3.jpg"] },
  { name:"Пуховик Carhartt Toronto", price:"25 000", color:"black", category:"верх", data_id:"puffer-carhartt-toronto", sku:"TTH-PFR-CHTT", sold_out:true, images:["assets/images/carhartt-toronto-1.jpg","assets/images/carhartt-toronto-2.jpg","assets/images/carhartt-toronto-3.jpg"] },
  { name:"Пуховик TNF", price:"22 000", color:"black", category:"верх", data_id:"puffer-tnf", sku:"TTH-PFR-TNF", sold_out:true, images:["assets/images/tnf-puffer-1.jpg","assets/images/tnf-puffer-2.jpg","assets/images/tnf-puffer-3.jpg"] },
  { name:"Жилет BBC Lining", price:"7 500", color:"black", category:"верх", data_id:"vest-bbc-lining", sku:"TTH-VST-BBC", images:["assets/images/bbc-vest-1.jpg","assets/images/bbc-vest-2.jpg","assets/images/bbc-vest-3.jpg"] },
  { name:"Карго Postaments", price:"8 500", color:"black", category:"низ", data_id:"pants-postaments-cargos", sku:"TTH-PNT-PSCG", images:["assets/images/postaments-cargo-1.jpg","assets/images/postaments-cargo-2.jpg","assets/images/postaments-cargo-3.jpg"] },
  { name:"Кепка Postaments Dads", price:"3 000", color:"black", category:"аксессуары", data_id:"cap-postaments-dads", sku:"TTH-CAP-PSDP", images:["assets/images/postaments-dads-1.jpg","assets/images/postaments-dads-2.jpg"] },
  { name:"Шапка Postaments Wordz", price:"2 500", color:"black", category:"аксессуары", data_id:"hat-postaments-wordz", sku:"TTH-HAT-PSWD", images:["assets/images/postaments-wordz-1.jpg","assets/images/postaments-wordz-2.jpg"] },
  { name:"Худи Postaments Cupids", price:"8 000", color:"black", category:"верх", data_id:"hoodie-postaments-cupids", sku:"TTH-HDH-PSCP", tag:"new", images:["assets/images/postaments-cupids-1.jpg","assets/images/postaments-cupids-2.jpg","assets/images/postaments-cupids-3.jpg"] },
  { name:"Худи Postaments Basic Choc", price:"7 000", color:"brown", category:"верх", data_id:"hoodie-postaments-basic-choc", sku:"TTH-HDH-PSBC", images:["assets/images/postaments-basic-choc-1.jpg","assets/images/postaments-basic-choc-2.jpg","assets/images/postaments-basic-choc-3.jpg"] },
  { name:"Футболка Postaments Shrooms", price:"3 500", color:"white", category:"верх", data_id:"tshirt-postaments-shrooms", sku:"TTH-TSR-PSSH", images:["assets/images/postaments-shrooms-1.jpg","assets/images/postaments-shrooms-2.jpg","assets/images/postaments-shrooms-3.jpg"] },
  { name:"Футболка Obey White", price:"4 000", color:"white", category:"верх", data_id:"tshirt-obey-white", sku:"TTH-TSR-OBYW", images:["assets/images/obey-white-1.jpg","assets/images/obey-white-2.jpg","assets/images/obey-white-3.jpg"] },
  { name:"Футболка Hockey", price:"4 500", color:"white", category:"верх", data_id:"tshirt-hockey", sku:"TTH-TSR-HCKY", images:["assets/images/hockey-tshirt-1.jpg","assets/images/hockey-tshirt-2.jpg","assets/images/hockey-tshirt-3.jpg"] },
  { name:"Футболка Awake NY", price:"5 000", color:"white", category:"верх", data_id:"tshirt-awake-ny", sku:"TTH-TSR-AWKN", images:["assets/images/awake-ny-1.jpg","assets/images/awake-ny-2.jpg","assets/images/awake-ny-3.jpg"] },
  { name:"Джинсы OKTYABR Baggy Blue", price:"7 000", color:"blue", category:"низ", data_id:"jeans-oktyabr-baggy-blue", sku:"TTH-JNS-OKBB", images:["assets/images/oktyabr-baggy-blue-1.jpg","assets/images/oktyabr-baggy-blue-2.jpg","assets/images/oktyabr-baggy-blue-3.jpg"] },
  { name:"Джинсы OKTYABR Baggy Gray", price:"7 000", color:"gray", category:"низ", data_id:"jeans-oktyabr-baggy-gray", sku:"TTH-JNS-OKBGY", images:["assets/images/oktyabr-baggy-gray-1.jpg","assets/images/oktyabr-baggy-gray-2.jpg","assets/images/oktyabr-baggy-gray-3.jpg"] },
  { name:"Джинсы OKTYABR Classic", price:"6 500", color:"blue", category:"низ", data_id:"jeans-oktyabr-classic", sku:"TTH-JNS-OKCL", images:["assets/images/oktyabr-classic-1.jpg","assets/images/oktyabr-classic-2.jpg","assets/images/oktyabr-classic-3.jpg"] },
  { name:"Сумка Hike", price:"4 000", color:"black", category:"аксессуары", data_id:"bag-hike", sku:"TTH-BAG-HIKE", images:["assets/images/bag-hike-1.jpg","assets/images/bag-hike-2.jpg"] },
  { name:"Шапка Thrasher", price:"3 000", color:"black", category:"аксессуары", data_id:"hat-thrasher", sku:"TTH-HAT-THR", images:["assets/images/hat-thrasher-1.jpg","assets/images/hat-thrasher-2.jpg"] },
  { name:"Шапка Obey Blue", price:"2 800", color:"blue", category:"аксессуары", data_id:"hat-obey-blue", sku:"TTH-HAT-OBYB", images:["assets/images/hat-obey-blue-1.jpg","assets/images/hat-obey-blue-2.jpg"] },
  { name:"Шапка HUF White", price:"2 800", color:"white", category:"аксессуары", data_id:"hat-huf-white", sku:"TTH-HAT-HUFW", images:["assets/images/hat-huf-white-1.jpg","assets/images/hat-huf-white-2.jpg"] },
  { name:"Шапка HUF Brown", price:"2 800", color:"brown", category:"аксессуары", data_id:"hat-huf-brown", sku:"TTH-HAT-HUFB", images:["assets/images/hat-huf-brown-1.jpg","assets/images/hat-huf-brown-2.jpg"] },
  { name:"Шапка Butter Goods", price:"3 000", color:"green", category:"аксессуары", data_id:"hat-butter-goods", sku:"TTH-HAT-BTTR", images:["assets/images/hat-butter-goods-1.jpg","assets/images/hat-butter-goods-2.jpg"] },
  { name:"Шапка Stussy", price:"3 500", color:"black", category:"аксессуары", data_id:"hat-stussy", sku:"TTH-HAT-STSY", images:["assets/images/hat-stussy-1.jpg","assets/images/hat-stussy-2.jpg"] },
];

console.log(`\nМиграция: ${products.length} товаров\n`);

const insertProduct = db.prepare(`
  INSERT OR REPLACE INTO products (name, price, old_price, color, category, tag, sold_out, sku, data_id, images, sizes, description, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertMany = db.transaction((items) => {
  db.prepare('DELETE FROM products').run();
  items.forEach((p, i) => {
    insertProduct.run(
      p.name, p.price, p.old_price || '', p.color || '', p.category || '',
      p.tag || '', p.sold_out ? 1 : 0, p.sku || '', p.data_id || null,
      JSON.stringify(p.images || []), '[]', '', i + 1
    );
  });
});

insertMany(products);

const count = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
console.log(`✓ Загружено в базу данных: ${count} товаров`);
console.log(`✓ База данных: ${dbPath}`);

const sample = db.prepare('SELECT id, name, price, color, category, sold_out FROM products LIMIT 5').all();
console.log('\nПримеры:');
sample.forEach(p => console.log(`  #${p.id} ${p.name} — ${p.price} ₽ (${p.color})${p.sold_out ? ' [ПРОДАНО]' : ''}`));

db.close();
console.log('\n✓ Миграция завершена!\n');
