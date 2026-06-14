// fix-image-paths.js — Match real image files to products in database
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', 'database.db');
const imagesDir = path.join(__dirname, '..', 'assets', 'images');
const db = new Database(dbPath);

// Get all real image files
const allFiles = fs.readdirSync(imagesDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
console.log(`Found ${allFiles.length} image files on disk\n`);

// Get all products from DB
const products = db.prepare('SELECT id, name, data_id FROM products ORDER BY id').all();
console.log(`Found ${products.length} products in DB\n`);

// Manual mapping: product name -> file name prefix
// We need to match product names to the actual file names on disk
const nameMapping = {
  'Брюки CODERED Ultrawide Summer': 'Брюки CODERED Ultrawide Summer',
  'Бомбер HJELP': 'Бомбер HJELP',
  'Salomon XT-6 Expanse': 'Кроссовки Salomon XT-6',
  'Кепка CP Company x Adidas': 'Кепка C.P. COMPANY x ADIDAS',
  'Брюки Dickies Double Knee': 'Брюки Dickies Double Knee Loose Fit',
  'Брюки HJELP Baggy': 'Брюки HJELP Baggy Fit',
  'Джинсы Carhartt B13': 'Джинсы Carhartt B13 Work Dungaree',
  'Джинсы РАССВЕТ': 'Джинсы Rassvet',
  'Джинсы OKTYABR Baggy': 'Джинсы Октябрь Baggy Fit',
  'Куртка HJELP Rain': 'Куртка HJELP Rain Jacket',
  'Ковёр Bitch': 'Коврик ручной работы Bitch',
  'Футболка CODERED Dacar': 'Футболка CODERED Over T Dacar',
  'Футболка CODERED Paint Tune': 'Футболка CODERED Over T Paint Tune',
  'Футболка CODERED Crumped Box': 'Футболка CODERED Regular Crumped Box',
  'Футболка CODERED Кусок Green': 'Футболка CODERED Regular Кусок',  // need to check which color
  'Футболка CODERED Кусок Black': 'Футболка CODERED Regular Кусок',  // need to check which color
  'Футболка CODERED Logo20 Black': 'Футболка CODERED Regular Лого 20 ТМ',
  'Футболка CODERED Logo20 Blue': 'Футболка CODERED Regular Лого 20 TM',
  'Худи CODERED Outline Logo 22': 'Толстовка-крюнек CODERED Firm Outline Logo 2',
  'Худи CODERED Rolluppers': 'Толстовка-крюнек CODERED Firm Wide Light Rolluppers',
  'Лонгслив CODERED Puzir Black': 'Футболка с длинным рукавом CODERED Пузырь',
  'Худи CODERED Piping Font': 'Толстовка-крюнек CODERED Firm Wide Light Piping Font',
  'Лонгслив CODERED Puzir Gray': 'Футболка с длинным рукавом CODERED Пузырь',  // same images?
  'Худи CODERED Logo30 TM': 'Толстовка-крюнек CODERED Firm Wide Лого 30 TM',
  'Пенал CODERED Gray': 'CODERED Пенал A Can1',  // gray variant
  'Пенал CODERED Blue': 'CODERED Пенал A Can2',  // blue variant
  'Пенал CODERED Black': 'CODERED Пенал A Can3',  // black variant
  'Шапка CODERED Logo Contour Black': 'Шапка CODERED Лого Контур',
  'Шапка CODERED Rib Mix Short White': 'Шапка CODERED Rib Mix Short',
  'Худи NB TNT Gray': 'Худи New Balance x Thisisneverthat',
  'Худи NB TNT Black': 'Худи New Balance x Thisisneverthat2',
  'Брюки BBC Lining Black': 'Спортивные штаны Billionaire Boys Club x Li-Ning',
  'Худи BBC Lining White': 'Худи Billionaire Boys Club x Li-Ning',
  'Zip Худи Pleasures': 'Зип-Худи Pleasures',
  'Пуховик Carhartt Toronto': 'Пуховик Carhartt WIP Toronto',
  'Пуховик TNF': 'Пуховик The North Face',
  'Жилет BBC Lining': 'Жилет утепленный Billionaire Boys Club x Li-Ning',
  'Карго Postaments': 'Брюки Postaments Cargos',
  'Кепка Postaments Dads': "Кепка Postaments Dad's Cap",
  'Шапка Postaments Wordz': 'Шапка Postaments Wordz',
  'Худи Postaments Cupids': 'Худи Postaments Cupids Black',
  'Худи Postaments Basic Choc': "Худи Postaments Basic SP'25 Choc",
  'Футболка Postaments Shrooms': 'Футболка Postaments Shrooms',
  'Футболка Obey White': 'Футболка Obey',
  'Футболка Hockey': 'Футболка Hockey',
  'Футболка Awake NY': 'Футболка Awake NY',
  'Джинсы OKTYABR Baggy Blue': 'Джинсы Октябрь Baggy2',
  'Джинсы OKTYABR Baggy Gray': 'Джинсы Октябрь Baggy3',
  'Джинсы OKTYABR Classic': 'Джинсы Октябрь Classic',
  'Сумка Hike': 'Сумка Hike',
  'Шапка Thrasher': 'Шапка Thrasher',
  'Шапка Obey Blue': 'Шапка Obey',
  'Шапка HUF White': 'Шапка HUF',
  'Шапка HUF Brown': 'Шапка HUF',  // may share images
  'Шапка Butter Goods': 'Шапка Butter Goods',
  'Шапка Stussy': 'Шапка Stussy',
  'Шапка Fucking Awesome': 'Шапка Fucking Awesome',
  'Шапка Postaments Ollie': 'Шапка Postaments Ollie',
  'Худи Postaments Dwarf': 'Худи Postaments Dwarf Black',
  'Толстовка CODERED Hoodie Wide': 'Толстовка CODERED Base Hoodie Wide Summer Лого TM',
  'Худи CODERED Reddy Boy': 'Толстовка-крюнек CODERED Firm Wide Light Reddy Boy',
  'Свитшот Postaments P Logo': 'Свитшот Postaments P Logo',
  'Лонгслив Postaments Think': 'Лонгслив Postaments Think',
  'Кепка Postaments Five': 'Кепка Postaments Five',
  'Кепка Postaments Flat': 'Кепка Postaments Flat',
  'Худи Fear of God': 'Худи Fear of God Essentials',
  'Худи HUF': 'Худи HUF',
  'Футболка Thrasher': 'Футболка Thrasher',
};

// Function to find matching files for a prefix
function findFilesForPrefix(prefix) {
  const matches = allFiles.filter(f => {
    const nameWithoutExt = f.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    return nameWithoutExt.startsWith(prefix);
  });
  // Sort naturally (1, 2, 3...)
  matches.sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, '') || '0');
    const numB = parseInt(b.replace(/\D/g, '') || '0');
    return numA - numB;
  });
  return matches.map(f => 'assets/images/' + f);
}

// Update each product
const updateStmt = db.prepare('UPDATE products SET images = ? WHERE id = ?');
let updated = 0;
let notFound = 0;

products.forEach(product => {
  const prefix = nameMapping[product.name];
  if (!prefix) {
    console.log(`⚠ No mapping for: "${product.name}"`);
    notFound++;
    return;
  }
  
  const files = findFilesForPrefix(prefix);
  if (files.length === 0) {
    console.log(`✗ No files found for: "${product.name}" (prefix: "${prefix}")`);
    notFound++;
    return;
  }
  
  updateStmt.run(JSON.stringify(files), product.id);
  console.log(`✓ ${product.name}: ${files.length} images`);
  updated++;
});

console.log(`\n=== Results ===`);
console.log(`Updated: ${updated}`);
console.log(`Not found: ${notFound}`);

// Verify
const verifyProducts = db.prepare('SELECT id, name, images FROM products ORDER BY id').all();
let totalImages = 0;
let missingImages = 0;
verifyProducts.forEach(p => {
  const imgs = JSON.parse(p.images || '[]');
  imgs.forEach(img => {
    const fullPath = path.join(__dirname, '..', img);
    if (fs.existsSync(fullPath)) {
      totalImages++;
    } else {
      missingImages++;
      console.log(`  STILL MISSING: [${p.name}] -> ${img}`);
    }
  });
});
console.log(`\nVerification: ${totalImages} found, ${missingImages} still missing`);

db.close();
