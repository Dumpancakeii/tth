const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'shop.html');
let html = fs.readFileSync(filePath, 'utf-8');

// 1. Fix colors
html = html.replace(`data-name="Бомбер HJELP1" data-price="7 990" data-color="Black"`, `data-name="Бомбер HJELP1" data-price="7 990" data-color="Blue"`);
html = html.replace(`data-name="Брюки CODERED Ultrawide Summer" data-price="7 200" data-color="Black"`, `data-name="Брюки CODERED Ultrawide Summer" data-price="7 200" data-color="Gray"`);
html = html.replace(`data-name="Кроссовки Salomon XT-6" data-price="17 500" data-color="Black"`, `data-name="Кроссовки Salomon XT-6" data-price="17 500" data-color="White"`);
html = html.replace(`data-name="Кепка C.P. COMPANY x ADIDAS" data-price="10 900" data-color="Black"`, `data-name="Кепка C.P. COMPANY x ADIDAS" data-price="10 900" data-color="Brown"`);

// 2. Move sold-out cards to end of product-grid
const gridMatch = html.match(/<div class="product-grid" id="productGrid">([\s\S]*?)<\/div>\s+<\/section>/);
if (gridMatch) {
  const gridContent = gridMatch[1];
  // Extract all product-card divs
  const cardRegex = /(.*?)(<div class="product-card[\s\S]*?<\/div>\s*<\/div>)/g;
  let match;
  const cards = [];
  let lastIndex = 0;
  while ((match = cardRegex.exec(gridContent)) !== null) {
    cards.push({ full: match[0], isSoldOut: match[2].includes('sold-out') });
    lastIndex = match.index + match[0].length;
  }
  
  // Separate available and sold-out
  const available = cards.filter(c => !c.isSoldOut);
  const soldOut = cards.filter(c => c.isSoldOut);
  const sorted = [...available, ...soldOut];
  
  // Rebuild grid content
  const newGridContent = sorted.map(c => c.full).join('');
  html = html.replace(gridMatch[1], '\n' + newGridContent + '\n      ');
}

fs.writeFileSync(filePath, html);
console.log('shop.html updated: colors fixed, sold-out moved to bottom');