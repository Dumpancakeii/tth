const fs = require('fs');
const path = require('path');

const pages = ['index.html', 'shop.html', 'lookbook.html', 'product.html', 'info.html', 'izbrannoe.html'];
const tgUrl = 'https://t.me/trustthehood';
const vkUrl = 'https://vk.com/trustthehood';

pages.forEach(pageName => {
  const filePath = path.join(__dirname, '..', pageName);
  if (!fs.existsSync(filePath)) {
    console.log(`${pageName} — файл не найден, пропускаю`);
    return;
  }
  
  let html = fs.readFileSync(filePath, 'utf-8');
  
  // Заменяем ссылки в блоке Соцсети
  // <a href="#">Telegram</a> → <a href="https://t.me/trustthehood">Telegram</a>
  // <a href="#">VKontakte</a> → <a href="https://vk.com/trustthehood">VKontakte</a>
  
  const tgRegex = /<a href="#">Telegram<\/a>/g;
  const vkRegex = /<a href="#">VKontakte<\/a>/g;
  
  if (tgRegex.test(html)) {
    html = html.replace(tgRegex, `<a href="${tgUrl}" target="_blank">Telegram</a>`);
    console.log(`${pageName} — Telegram ссылка обновлена`);
  }
  
  if (vkRegex.test(html)) {
    html = html.replace(vkRegex, `<a href="${vkUrl}" target="_blank">VKontakte</a>`);
    console.log(`${pageName} — VKontakte ссылка обновлена`);
  }
  
  fs.writeFileSync(filePath, html, 'utf-8');
});

console.log('Готово!');