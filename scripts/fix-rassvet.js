const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'shop.html');
let html = fs.readFileSync(filePath, 'utf-8');

// Исправляем сломанную структуру Rassvet
const broken = `        <div class="product-card sold-out" data-name="Джинсы Rassvet" data-price="13 490" data-color="black" data-category="низ" data-tag="sale"></div>
          <div class="product-image">
            <img class="gallery-img" data-index="0" src="assets/images/Джинсы Rassvet1.jpg" alt="Джинсы Rassvet">
            <img class="gallery-img" data-index="1" src="assets/images/Джинсы Rassvet2.jpg" alt="Джинсы Rassvet">
            <img class="gallery-img" data-index="2" src="assets/images/Джинсы Rassvet3.jpg" alt="Джинсы Rassvet">
            <button class="favorite-btn" data-id="jeans-rassvet">♡</button>
            <div class="gallery-dots">
              <span class="gallery-dot" data-index="0"></span>
              <span class="gallery-dot" data-index="1"></span>
              <span class="gallery-dot" data-index="2"></span>
            </div>
          </div>
          <div class="product-title">Джинсы Rassvet</div>
          <div class="product-price"><span class="old-price">15 990 ₽</span><span class="sale-price">13 490 ₽</span></div>
        </div>`;

const fixed = `        <div class="product-card sold-out" data-name="Джинсы Rassvet" data-price="13 490" data-color="black" data-category="низ" data-tag="sale">
          <div class="product-image">
            <img class="gallery-img" data-index="0" src="assets/images/Джинсы Rassvet1.jpg" alt="Джинсы Rassvet">
            <img class="gallery-img" data-index="1" src="assets/images/Джинсы Rassvet2.jpg" alt="Джинсы Rassvet">
            <img class="gallery-img" data-index="2" src="assets/images/Джинсы Rassvet3.jpg" alt="Джинсы Rassvet">
            <button class="favorite-btn" data-id="jeans-rassvet">♡</button>
            <div class="gallery-dots">
              <span class="gallery-dot" data-index="0"></span>
              <span class="gallery-dot" data-index="1"></span>
              <span class="gallery-dot" data-index="2"></span>
            </div>
          </div>
          <div class="product-title">Джинсы Rassvet</div>
          <div class="product-price"><span class="old-price">15 990 ₽</span><span class="sale-price">13 490 ₽</span></div>
        </div>`;

if (html.includes(broken)) {
  html = html.replace(broken, fixed);
  fs.writeFileSync(filePath, html, 'utf-8');
  console.log('Rassvet — структура исправлена');
} else {
  console.log('Не найдена сломанная структура Rassvet, проверяю');
  // Проверим, есть ли лишний </div>
  const check = html.match(/Джинсы Rassvet[\s\S]*?<\/div>\s*<div class="product-card sold-out"/);
  if (check) console.log('Найдено совпадение для диагностики');
}