const fs = require('fs');
const path = require('path');

const files = ['index.html', 'info.html', 'izbrannoe.html', 'lookbook.html', 'product.html'];

const filterPanel = `  <!-- ===== ПАНЕЛЬ ФИЛЬТРОВ ===== -->
  <div class="filter-panel" id="filterPanel">
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

for (const file of files) {
  const filePath = path.join(__dirname, '..', file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if filter panel already exists
  if (content.includes('filter-panel')) {
    console.log(`${file}: filter panel already exists, skipping`);
    continue;
  }

  // Insert filter panel after the mobile-nav section and before main
  content = content.replace('  <!-- ===== ОСНОВНОЙ КОНТЕНТ ===== -->', filterPanel + '\n\n  <!-- ===== ОСНОВНОЙ КОНТЕНТ ===== -->');
  
  fs.writeFileSync(filePath, content);
  console.log(`${file}: filter panel added`);
}

console.log('Done');