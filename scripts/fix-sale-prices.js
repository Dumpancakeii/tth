const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'shop.html');
let html = fs.readFileSync(filePath, 'utf-8');

// 1. Джинсы Carhartt B13 Work Dungaree — убрать sold-out, цена была 8 900, стала 6 490
html = html.replace(
  `<div class="product-card" data-name="Джинсы Carhartt B13 Work Dungaree" data-price="6 490" data-color="black" data-category="низ" data-tag="sale">\r\n          <div class="product-image">\r\n            <img class="gallery-img" data-index="0" src="assets/images/Джинсы Carhartt B13 Work Dungaree1.jpg" alt="Джинсы Carhartt B13 Work Dungaree">\r\n            <img class="gallery-img" data-index="1" src="assets/images/Джинсы Carhartt B13 Work Dungaree2.jpg" alt="Джинсы Carhartt B13 Work Dungaree">\r\n            <button class="favorite-btn" data-id="jeans-carhartt-b13">♡</button>\r\n            <div class="gallery-dots">\r\n              <span class="gallery-dot" data-index="0"></span>\r\n              <span class="gallery-dot" data-index="1"></span>\r\n            </div>\r\n          </div>\r\n          <div class="product-title">Джинсы Carhartt B13 Work Dungaree</div>\r\n          <div class="product-price">6 490 ₽</div>\r\n        </div>`,
  `<div class="product-card" data-name="Джинсы Carhartt B13 Work Dungaree" data-price="6 490" data-color="black" data-category="низ" data-tag="sale">\r\n          <div class="product-image">\r\n            <img class="gallery-img" data-index="0" src="assets/images/Джинсы Carhartt B13 Work Dungaree1.jpg" alt="Джинсы Carhartt B13 Work Dungaree">\r\n            <img class="gallery-img" data-index="1" src="assets/images/Джинсы Carhartt B13 Work Dungaree2.jpg" alt="Джинсы Carhartt B13 Work Dungaree">\r\n            <button class="favorite-btn" data-id="jeans-carhartt-b13">♡</button>\r\n            <div class="gallery-dots">\r\n              <span class="gallery-dot" data-index="0"></span>\r\n              <span class="gallery-dot" data-index="1"></span>\r\n            </div>\r\n          </div>\r\n          <div class="product-title">Джинсы Carhartt B13 Work Dungaree</div>\r\n          <div class="product-price"><span class="old-price">8 900 ₽</span><span class="sale-price">6 490 ₽</span></div>\r\n        </div>`
);

// 2. Джинсы Rassvet — убрать sold-out, цена была 15 990, стала 13 490, добавить data-tag="sale"
html = html.replace(
  `<div class="product-card sold-out" data-name="Джинсы Rassvet" data-price="13 490" data-color="black" data-category="низ">`,
  `<div class="product-card" data-name="Джинсы Rassvet" data-price="13 490" data-color="black" data-category="низ" data-tag="sale">`
);

// Обновляем цену для Rassvet
html = html.replace(
  `Джинсы Rassvet</div>\r\n          <div class="product-price">13 490 ₽</div>\r\n        </div>\r\n        <div class="product-card sold-out" data-name="Брюки Postaments Cargos"`,
  `Джинсы Rassvet</div>\r\n          <div class="product-price"><span class="old-price">15 990 ₽</span><span class="sale-price">13 490 ₽</span></div>\r\n        </div>\r\n        <div class="product-card sold-out" data-name="Брюки Postaments Cargos"`
);

// 3. Джинсы Октябрь Baggy Fit — убрать sold-out, цена была 7 490, стала 6 490, добавить data-tag="sale"
// Эта карточка не была sold-out, но у неё стоит цена 6 490, а должна быть старая 7 490, новая 6 490
// Ищем карточку: <div class="product-card" data-name="Джинсы Октябрь Baggy Fit" data-price="6 490"
// Это единственная карточка с таким названием
html = html.replace(
  `<div class="product-card" data-name="Джинсы Октябрь Baggy Fit" data-price="6 490" data-color="black" data-category="низ">\r\n          <div class="product-image">\r\n            <img class="gallery-img" data-index="0" src="assets/images/Джинсы Октябрь Baggy Fit1.jpg" alt="Джинсы Октябрь Baggy Fit">\r\n            <img class="gallery-img" data-index="1" src="assets/images/Джинсы Октябрь Baggy Fit2.jpg" alt="Джинсы Октябрь Baggy Fit">\r\n            <button class="favorite-btn" data-id="jeans-oktyabr-baggy">♡</button>\r\n            <div class="gallery-dots">\r\n              <span class="gallery-dot" data-index="0"></span>\r\n              <span class="gallery-dot" data-index="1"></span>\r\n            </div>\r\n          </div>\r\n          <div class="product-title">Джинсы Октябрь Baggy Fit</div>\r\n          <div class="product-price">6 490 ₽</div>\r\n        </div>`,
  `<div class="product-card" data-name="Джинсы Октябрь Baggy Fit" data-price="6 490" data-color="black" data-category="низ" data-tag="sale">\r\n          <div class="product-image">\r\n            <img class="gallery-img" data-index="0" src="assets/images/Джинсы Октябрь Baggy Fit1.jpg" alt="Джинсы Октябрь Baggy Fit">\r\n            <img class="gallery-img" data-index="1" src="assets/images/Джинсы Октябрь Baggy Fit2.jpg" alt="Джинсы Октябрь Baggy Fit">\r\n            <button class="favorite-btn" data-id="jeans-oktyabr-baggy">♡</button>\r\n            <div class="gallery-dots">\r\n              <span class="gallery-dot" data-index="0"></span>\r\n              <span class="gallery-dot" data-index="1"></span>\r\n            </div>\r\n          </div>\r\n          <div class="product-title">Джинсы Октябрь Baggy Fit</div>\r\n          <div class="product-price"><span class="old-price">7 490 ₽</span><span class="sale-price">6 490 ₽</span></div>\r\n        </div>`
);

fs.writeFileSync(filePath, html, 'utf-8');
console.log('Цены со скидками обновлены!');