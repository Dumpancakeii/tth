const fs = require('fs');
const path = require('path');

const htmlFiles = ['index.html', 'info.html', 'izbrannoe.html', 'lookbook.html', 'product.html', 'shop.html'];

for (const file of htmlFiles) {
  const filePath = path.join(__dirname, '..', file);
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace('заполните это поле, пожалуйста', 'укажите корректную почту');
  fs.writeFileSync(filePath, content);
  console.log(`${file} updated`);
}

console.log('All HTML files updated with correct email validation message');