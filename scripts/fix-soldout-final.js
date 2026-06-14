const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'shop.html');
let html = fs.readFileSync(filePath, 'utf-8');

// 1. Джинсы Carhartt B13 Work Dungaree — добавить sold-out и метку продано
const carharttSearch = 'class="product-card" data-name="Джинсы Carhartt B13 Work Dungaree" data-price="6 490" data-color="black" data-category="низ" data-tag="sale">';
const carharttReplace = 'class="product-card sold-out" data-name="Джинсы Carhartt B13 Work Dungaree" data-price="6 490" data-color="black" data-category="низ" data-tag="sale">';

html = html.replace(carharttSearch, carharttReplace);

// Добавить метку продано для Carhartt (если её нет)
const carharttPriceBlock = 'Джинсы Carhartt B13 Work Dungaree</div>\r\n          <div class="product-price"><span class="old-price">8 900 ₽</span><span class="sale-price">6 490 ₽</span></div>';
const carharttPriceFixed = 'Джинсы Carhartt B13 Work Dungaree</div>\r\n          <div class="product-price"><span class="old-price">8 900 ₽</span><span class="sale-price">6 490 ₽</span> <span class="sold-out-label">продано</span></div>';

if (html.includes(carharttPriceBlock)) {
  html = html.replace(carharttPriceBlock, carharttPriceFixed);
  console.log('Carhartt — цена обновлена с меткой продано');
} else {
  console.log('Carhartt — не найдена строка цены для обновления');
}

// 2. Джинсы Rassvet — добавить sold-out и метку продано
const rassvetSearch = 'class="product-card" data-name="Джинсы Rassvet" data-price="13 490" data-color="black" data-category="низ" data-tag="sale">';
const rassvetReplace = 'class="product-card sold-out" data-name="Джинсы Rassvet" data-price="13 490" data-color="black" data-category="низ" data-tag="sale">';

html = html.replace(rassvetSearch, rassvetReplace);

// Добавить метку продано для Rassvet (если её нет)
const rassvetPriceBlock = 'Джинсы Rassvet</div>\r\n          <div class="product-price"><span class="old-price">15 990 ₽</span><span class="sale-price">13 490 ₽</span></div>';
const rassvetPriceFixed = 'Джинсы Rassvet</div>\r\n          <div class="product-price"><span class="old-price">15 990 ₽</span><span class="sale-price">13 490 ₽</span> <span class="sold-out-label">продано</span></div>';

if (html.includes(rassvetPriceBlock)) {
  html = html.replace(rassvetPriceBlock, rassvetPriceFixed);
  console.log('Rassvet — цена обновлена с меткой продано');
} else {
  console.log('Rassvet — не найдена строка цены для обновления');
}

fs.writeFileSync(filePath, html, 'utf-8');
console.log('Готово!');