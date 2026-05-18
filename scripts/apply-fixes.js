const fs = require('fs');
const path = require('path');

const NL = '\r\n';

// ================================
// 1. SHOP.HTML: добавить метку "продано" для sold-out карточек
// ================================
function fixShopHtml() {
  const filePath = path.join(__dirname, '..', 'shop.html');
  let html = fs.readFileSync(filePath, 'utf-8');

  // Найти все sold-out карточки и добавить метку "продано" в product-price
  // Заменяем: <div class="product-price">ЦЕНА ₽</div>
  // На:       <div class="product-price">ЦЕНА ₽ <span class="sold-out-label">продано</span></div>
  // Только для карточек с классом sold-out

  // Разбиваем на карточки, ищем sold-out
  const cardRegex = /(<div class="product-card sold-out"[\s\S]*?<\/div>\s*<\/div>)/g;
  html = html.replace(cardRegex, (match) => {
    // Проверяем, есть ли уже метка продано
    if (match.includes('sold-out-label')) {
      return match;
    }
    // Добавляем метку
    return match.replace(
      /(<div class="product-price">)([^<]+)(<\/div>)/,
      '$1$2 <span class="sold-out-label">продано</span>$3'
    );
  });

  fs.writeFileSync(filePath, html, 'utf-8');
  console.log('shop.html — добавлены метки "продано" для sold-out товаров');
}

// ================================
// 2. СИНХРОНИЗАЦИЯ ФИЛЬТРА на всех страницах
// ================================
const FULL_FILTER_HTML = `  <div class="filter-panel" id="filterPanel">
    <div class="filter-row">
      <div class="filter-group">
        <label class="filter-label">Категория</label>
        <select id="filterCategory">
          <option value="">Все</option>
          <option value="верх">Верх</option>
          <option value="низ">Низ</option>
          <option value="обувь">Обувь</option>
          <option value="аксессуары">Аксессуары</option>
          <option value="ковры">Ковры</option>
        </select>
      </div>
      <div class="filter-group">
        <label class="filter-label">Цвет</label>
        <div class="filter-color-options" id="filterColor">
          <button class="filter-color-btn active" data-color="">Все</button>
          <button class="filter-color-btn" data-color="Black" style="background:#111;color:#fff">Чёрный</button>
          <button class="filter-color-btn" data-color="Green" style="background:#2e7d32;color:#fff">Зелёный</button>
          <button class="filter-color-btn" data-color="Blue" style="background:#1565c0;color:#fff">Синий</button>
          <button class="filter-color-btn" data-color="White" style="background:#fff;color:#111;border-color:#111">Белый</button>
          <button class="filter-color-btn" data-color="Gray" style="background:#9e9e9e;color:#fff">Серый</button>
          <button class="filter-color-btn" data-color="Brown" style="background:#795548;color:#fff">Коричневый</button>
          <button class="filter-color-btn" data-color="Graphite" style="background:#424242;color:#fff">Графитовый</button>
          <button class="filter-color-btn" data-color="Pink" style="background:#e91e63;color:#fff">Розовый</button>
          <button class="filter-color-btn" data-color="Pattern" style="background:linear-gradient(135deg,#e53935,#fdd835,#43a047,#1e88e5,#8e24aa);color:#fff">Рисунок</button>
        </div>
      </div>
      <div class="filter-group">
        <label class="filter-label">Цена</label>
        <select id="filterPrice">
          <option value="">Любая</option>
          <option value="0-5000">до 5 000 ₽</option>
          <option value="5000-10000">5 000 – 10 000 ₽</option>
          <option value="10000-20000">10 000 – 20 000 ₽</option>
          <option value="20000+">от 20 000 ₽</option>
        </select>
      </div>
    </div>
  </div>`;

const FILTER_START = '  <!-- ===== ПАНЕЛЬ ФИЛЬТРОВ ===== -->';
const FILTER_END = '  <!-- ===== МОБИЛЬНАЯ НАВИГАЦИЯ ===== -->';

function syncFilterOnPage(pageName) {
  const filePath = path.join(__dirname, '..', pageName);
  let html = fs.readFileSync(filePath, 'utf-8');

  const startIdx = html.indexOf(FILTER_START);
  const endIdx = html.indexOf(FILTER_END);

  if (startIdx === -1 || endIdx === -1) {
    console.log(`${pageName} — не найдены маркеры фильтра, пропускаю`);
    return;
  }

  const before = html.slice(0, startIdx);
  const after = html.slice(endIdx);

  const result = before + FILTER_START + NL + FULL_FILTER_HTML + NL + after;
  fs.writeFileSync(filePath, result, 'utf-8');
  console.log(`${pageName} — фильтр синхронизирован`);
}

// ================================
// 3. INDEX.HTML: добавить секцию со скидками
// ================================
function addSaleSectionToIndex() {
  const filePath = path.join(__dirname, '..', 'index.html');
  let html = fs.readFileSync(filePath, 'utf-8');

  const saleSection = `    <!-- СЕКЦИЯ СО СКИДКАМИ -->
    <section class="section fade-in">
      <div class="section-header" style="display:flex;justify-content:space-between;align-items:flex-end;">
        <div>
          <div class="section-label">— Скидки</div>
          <h2>Распродажа</h2>
        </div>
        <a href="shop.html?filter=sale" style="font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#111;text-decoration:none;display:flex;align-items:center;gap:8px;white-space:nowrap;">
          Смотреть все
          <span style="font-size:18px;line-height:1;">→</span>
        </a>
      </div>
      <div class="product-grid">
        <div class="product-card sold-out" data-name="Бомбер HJELP1" data-price="7 990" data-color="Blue" data-tag="sale" data-category="верх">
          <div class="product-image">
            <img class="gallery-img" data-index="0" src="assets/images/Бомбер HJELP1.jpg" alt="Бомбер HJELP1">
            <img class="gallery-img" data-index="1" src="assets/images/Бомбер HJELP2.jpg" alt="Бомбер HJELP2">
            <img class="gallery-img" data-index="2" src="assets/images/Бомбер HJELP3.jpg" alt="Бомбер HJELP3">
            <img class="gallery-img" data-index="3" src="assets/images/Бомбер HJELP4.jpg" alt="Бомбер HJELP4">
            <button class="favorite-btn" data-id="bomber-hjelp1">♡</button>
            <div class="product-overlay"></div>
            <div class="gallery-dots">
              <span class="gallery-dot" data-index="0"></span>
              <span class="gallery-dot" data-index="1"></span>
              <span class="gallery-dot" data-index="2"></span>
              <span class="gallery-dot" data-index="3"></span>
            </div>
          </div>
          <div class="product-title">Бомбер HJELP1</div>
          <div class="product-price">7 990 ₽ <span class="sold-out-label">продано</span></div>
        </div>
        <div class="product-card" data-name="Брюки CODERED Ultrawide Summer" data-price="7 200" data-color="Gray" data-tag="sale" data-category="низ">
          <div class="product-image">
            <img class="gallery-img" data-index="0" src="assets/images/Брюки CODERED Ultrawide Summer1.jpg" alt="Брюки CODERED Ultrawide Summer">
            <img class="gallery-img" data-index="1" src="assets/images/Брюки CODERED Ultrawide Summer2.jpg" alt="Брюки CODERED Ultrawide Summer">
            <img class="gallery-img" data-index="2" src="assets/images/Брюки CODERED Ultrawide Summer3.jpg" alt="Брюки CODERED Ultrawide Summer">
            <img class="gallery-img" data-index="3" src="assets/images/Брюки CODERED Ultrawide Summer4.jpg" alt="Брюки CODERED Ultrawide Summer">
            <img class="gallery-img" data-index="4" src="assets/images/Брюки CODERED Ultrawide Summer5.jpg" alt="Брюки CODERED Ultrawide Summer">
            <img class="gallery-img" data-index="5" src="assets/images/Брюки CODERED Ultrawide Summer6.jpg" alt="Брюки CODERED Ultrawide Summer">
            <button class="favorite-btn" data-id="pants-codered">♡</button>
            <div class="gallery-dots">
              <span class="gallery-dot" data-index="0"></span>
              <span class="gallery-dot" data-index="1"></span>
              <span class="gallery-dot" data-index="2"></span>
              <span class="gallery-dot" data-index="3"></span>
              <span class="gallery-dot" data-index="4"></span>
              <span class="gallery-dot" data-index="5"></span>
            </div>
          </div>
          <div class="product-title">Брюки CODERED Ultrawide Summer</div>
          <div class="product-price">7 200 ₽</div>
        </div>
        <div class="product-card" data-name="Пуховик The North Face" data-price="15 490" data-color="Gray" data-tag="sale" data-category="верх">
          <div class="product-image">
            <img class="gallery-img" data-index="0" src="assets/images/Пуховик The North Face1.jpeg" alt="Пуховик The North Face">
            <img class="gallery-img" data-index="1" src="assets/images/Пуховик The North Face2.jpeg" alt="Пуховик The North Face">
            <button class="favorite-btn" data-id="puffer-tnf">♡</button>
            <div class="gallery-dots">
              <span class="gallery-dot" data-index="0"></span>
              <span class="gallery-dot" data-index="1"></span>
            </div>
          </div>
          <div class="product-title">Пуховик The North Face</div>
          <div class="product-price">15 490 ₽</div>
        </div>
        <div class="product-card" data-name="Шапка CODERED Rib Mix Short" data-price="2 000" data-color="White" data-tag="sale" data-category="аксессуары">
          <div class="product-image">
            <img class="gallery-img" data-index="0" src="assets/images/Шапка CODERED Rib Mix Short1.jpeg" alt="Шапка CODERED Rib Mix Short">
            <img class="gallery-img" data-index="1" src="assets/images/Шапка CODERED Rib Mix Short2.jpeg" alt="Шапка CODERED Rib Mix Short">
            <img class="gallery-img" data-index="2" src="assets/images/Шапка CODERED Rib Mix Short3.jpeg" alt="Шапка CODERED Rib Mix Short">
            <button class="favorite-btn" data-id="hat-codered-rib-mix-short-white">♡</button>
            <div class="gallery-dots">
              <span class="gallery-dot" data-index="0"></span>
              <span class="gallery-dot" data-index="1"></span>
              <span class="gallery-dot" data-index="2"></span>
            </div>
          </div>
          <div class="product-title">Шапка CODERED Rib Mix Short</div>
          <div class="product-price">2 000 ₽</div>
        </div>
      </div>
    </section>`;

  // Вставляем после секции "SS26 Капсула" (после первого </section> с классом section fade-in)
  // Ищем закрывающий тег первой секции .section.fade-in после hero
  const marker = '<!-- СЕТКА ТОВАРОВ: Последний дроп -->';
  const markerIdx = html.indexOf(marker);
  if (markerIdx === -1) {
    console.log('index.html — не найден маркер для вставки секции скидок');
    return;
  }

  // Ищем закрывающий </section> после маркера
  const afterMarker = html.slice(markerIdx);
  let depth = 0;
  let found = false;
  let closeIdx = -1;
  for (let i = 0; i < afterMarker.length; i++) {
    if (afterMarker.slice(i, i + 7) === '<' + '/section>') {
      if (depth === 0) {
        closeIdx = i + '</section>'.length;
        found = true;
        break;
      }
    } else if (afterMarker.slice(i, i + 8) === '<section') {
      depth++;
    }
  }

  if (!found) {
    console.log('index.html — не найден конец секции для вставки');
    return;
  }

  const insertPos = markerIdx + closeIdx;
  html = html.slice(0, insertPos) + NL + saleSection + NL + html.slice(insertPos);

  fs.writeFileSync(filePath, html, 'utf-8');
  console.log('index.html — добавлена секция со скидками');
}

// ================================
// ЗАПУСК
// ================================
console.log('=== Применение исправлений ===');
fixShopHtml();
syncFilterOnPage('index.html');
syncFilterOnPage('product.html');
syncFilterOnPage('lookbook.html');
addSaleSectionToIndex();
console.log('=== Готово ===');