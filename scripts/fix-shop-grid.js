const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'shop.html');
let html = fs.readFileSync(filePath, 'utf-8');

// Определяем, какие переносы строк используются
const nl = html.includes('\r\n') ? '\r\n' : '\n';

// Найдём содержимое product-grid
const startMarker = `<div class="product-grid" id="productGrid">`;
const startIdx = html.indexOf(startMarker);
if (startIdx === -1) {
  console.error('Не найден startMarker');
  process.exit(1);
}

const gridContentStart = startIdx + startMarker.length;

// Ищем закрывающий </div> для product-grid
const restAfterGrid = html.slice(gridContentStart);
const sectionEndMarker = `</div>${nl}    </section>`;

const gridEndIdx = restAfterGrid.indexOf(sectionEndMarker);
if (gridEndIdx === -1) {
  console.error('Не найден конец grid секции');
  process.exit(1);
}

const gridInner = restAfterGrid.slice(0, gridEndIdx);
const afterGrid = restAfterGrid.slice(gridEndIdx);

// Разбираем карточки
const cardStartPattern = /<div class="product-card[\s\S]*?">/g;
let match;
let positions = [];
while ((match = cardStartPattern.exec(gridInner)) !== null) {
  positions.push(match.index);
}

console.log(`Найдено карточек: ${positions.length}`);

let fixedCards = [];

for (let i = 0; i < positions.length; i++) {
  const start = positions[i];
  const end = positions[i + 1] || gridInner.length;
  
  const rawCard = gridInner.slice(start, end);
  
  // Извлекаем атрибуты
  const nameMatch = rawCard.match(/data-name="([^"]*)"/);
  const priceMatch = rawCard.match(/data-price="([^"]*)"/);
  const colorMatch = rawCard.match(/data-color="([^"]*)"/);
  const categoryMatch = rawCard.match(/data-category="([^"]*)"/);
  const tagMatch = rawCard.match(/data-tag="([^"]*)"/);
  
  const name = nameMatch ? nameMatch[1] : '';
  const price = priceMatch ? priceMatch[1] : '';
  const color = colorMatch ? colorMatch[1].toLowerCase() : '';
  const category = categoryMatch ? categoryMatch[1].toLowerCase() : '';
  const tag = tagMatch ? tagMatch[1] : '';
  
  // Определяем классы
  let cardClasses = 'product-card';
  if (rawCard.includes('sold-out')) {
    cardClasses = 'product-card sold-out';
  }
  
  // Собираем data-атрибуты
  let dataAttrs = `data-name="${name}" data-price="${price}"`;
  if (color) dataAttrs += ` data-color="${color}"`;
  if (category) dataAttrs += ` data-category="${category}"`;
  if (tag) dataAttrs += ` data-tag="${tag}"`;
  
  // Извлекаем содержимое product-image
  const imgStartTag = '<div class="product-image">';
  const imgStartIdx = rawCard.indexOf(imgStartTag);
  if (imgStartIdx === -1) {
    console.error(`Не найден product-image в карточке ${i}`);
    continue;
  }
  
  // Находим закрывающий </div> с учётом вложенности для product-image
  let depth = 1;
  let pos = imgStartIdx + imgStartTag.length;
  while (depth > 0 && pos < rawCard.length) {
    const nextOpen = rawCard.indexOf('<div', pos);
    const nextClose = rawCard.indexOf('</div>', pos);
    
    if (nextClose === -1) break;
    
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      pos = nextOpen + '<div'.length;
    } else {
      depth--;
      pos = nextClose + '</div>'.length;
    }
  }
  
  const imageContent = rawCard.slice(imgStartIdx, pos);
  
  // Формируем правильную карточку
  let fixedCard = `        <div class="${cardClasses}" ${dataAttrs}>${nl}`;
  fixedCard += `          ${imageContent}${nl}`;
  fixedCard += `          <div class="product-title">${name}</div>${nl}`;
  fixedCard += `          <div class="product-price">${price} ₽</div>${nl}`;
  fixedCard += `        </div>`;
  
  fixedCards.push(fixedCard);
}

// Собираем результат
const fixedGridContent = fixedCards.join(nl);
const result = html.slice(0, gridContentStart) + nl + fixedGridContent + nl + afterGrid;

fs.writeFileSync(filePath, result, 'utf-8');
console.log(`Файл shop.html успешно исправлен! Обработано карточек: ${positions.length}`);