// TrustTheHood — Express + SQLite Server
const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');
const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Database ────────────────────────────────────────────────────────
const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    old_price TEXT DEFAULT '',
    color TEXT DEFAULT '',
    category TEXT DEFAULT '',
    tag TEXT DEFAULT '',
    sold_out INTEGER DEFAULT 0,
    sku TEXT DEFAULT '',
    data_id TEXT UNIQUE,
    images TEXT DEFAULT '[]',
    sizes TEXT DEFAULT '[]',
    description TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    page TEXT DEFAULT '',
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS newsletters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    sent_to INTEGER DEFAULT 0,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT DEFAULT ''
  );
`);

// Default SMTP settings
const defaultSettings = {
  smtp_host: 'smtp.gmail.com',
  smtp_port: '587',
  smtp_user: '',
  smtp_pass: '',
  smtp_from: 'TrustTheHood <noreply@trustthehood.ru>',
  admin_password: 'admin123'
};

const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
for (const [key, value] of Object.entries(defaultSettings)) {
  insertSetting.run(key, value);
}

// ─── Helpers ─────────────────────────────────────────────────────────
function getSetting(key) {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
  return row ? row.value : '';
}

function setSetting(key, value) {
  db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value);
}

// ─── Middleware ───────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(__dirname, {
  extensions: ['html'],
  index: 'index.html'
}));

// Simple admin auth middleware
function adminAuth(req, res, next) {
  const password = req.headers['x-admin-password'] || req.query.password || '';
  const correctPassword = getSetting('admin_password');
  if (password === correctPassword) {
    return next();
  }
  res.status(401).json({ error: 'Неверный пароль администратора' });
}

// ─── Image Upload ────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, 'assets', 'images');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    // Keep original name but sanitize
    const name = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null, name);
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ═══════════════════════════════════════════════════════════════════════
// API: PRODUCTS
// ═══════════════════════════════════════════════════════════════════════

// GET /api/products — all products
app.get('/api/products', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products ORDER BY sort_order ASC, id ASC').all();
    // Parse JSON fields
    const result = products.map(p => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
      sizes: JSON.parse(p.sizes || '[]'),
      sold_out: !!p.sold_out
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id — single product
app.get('/api/products/:id', (req, res) => {
  try {
    const p = db.prepare('SELECT * FROM products WHERE id = ? OR data_id = ?').get(req.params.id, req.params.id);
    if (!p) return res.status(404).json({ error: 'Товар не найден' });
    res.json({
      ...p,
      images: JSON.parse(p.images || '[]'),
      sizes: JSON.parse(p.sizes || '[]'),
      sold_out: !!p.sold_out
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products — create product (admin)
app.post('/api/products', adminAuth, (req, res) => {
  try {
    const { name, price, old_price, color, category, tag, sold_out, sku, data_id, images, sizes, description, sort_order } = req.body;
    const stmt = db.prepare(`
      INSERT INTO products (name, price, old_price, color, category, tag, sold_out, sku, data_id, images, sizes, description, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      name || '', price || '', old_price || '', color || '', category || '',
      tag || '', sold_out ? 1 : 0, sku || '', data_id || null,
      JSON.stringify(images || []), JSON.stringify(sizes || []),
      description || '', sort_order || 0
    );
    res.json({ id: result.lastInsertRowid, message: 'Товар создан' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id — update product (admin)
app.put('/api/products/:id', adminAuth, (req, res) => {
  try {
    const { name, price, old_price, color, category, tag, sold_out, sku, data_id, images, sizes, description, sort_order } = req.body;
    const stmt = db.prepare(`
      UPDATE products SET name=?, price=?, old_price=?, color=?, category=?, tag=?, sold_out=?, sku=?, data_id=?, images=?, sizes=?, description=?, sort_order=?
      WHERE id=?
    `);
    stmt.run(
      name || '', price || '', old_price || '', color || '', category || '',
      tag || '', sold_out ? 1 : 0, sku || '', data_id || null,
      JSON.stringify(images || []), JSON.stringify(sizes || []),
      description || '', sort_order || 0,
      req.params.id
    );
    res.json({ message: 'Товар обновлён' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/products/:id — delete product (admin)
app.delete('/api/products/:id', adminAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ message: 'Товар удалён' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products/upload-image — upload product image (admin)
app.post('/api/products/upload-image', adminAuth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Файл не загружен' });
  const relativePath = 'assets/images/' + req.file.filename;
  res.json({ path: relativePath, filename: req.file.filename });
});

// ═══════════════════════════════════════════════════════════════════════
// API: SUBSCRIBERS
// ═══════════════════════════════════════════════════════════════════════

// POST /api/subscribe — public subscription
app.post('/api/subscribe', (req, res) => {
  try {
    const { email, page } = req.body;
    if (!email || !/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return res.status(400).json({ error: 'Некорректный email' });
    }
    const stmt = db.prepare('INSERT OR IGNORE INTO subscribers (email, page) VALUES (?, ?)');
    stmt.run(email, page || '');
    res.json({ message: 'Подписка оформлена' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/subscribers — list all (admin)
app.get('/api/subscribers', adminAuth, (req, res) => {
  try {
    const subs = db.prepare('SELECT * FROM subscribers ORDER BY subscribed_at DESC').all();
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/subscribers/:id — delete subscriber (admin)
app.delete('/api/subscribers/:id', adminAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM subscribers WHERE id = ?').run(req.params.id);
    res.json({ message: 'Подписчик удалён' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/subscribers/export/csv — export CSV (admin)
app.get('/api/subscribers/export/csv', adminAuth, (req, res) => {
  try {
    const subs = db.prepare('SELECT * FROM subscribers ORDER BY subscribed_at DESC').all();
    const BOM = '\uFEFF';
    const header = 'Email,Страница,Дата подписки';
    const rows = subs.map(s => `"${s.email}","${s.page}","${s.subscribed_at}"`);
    const csv = BOM + header + '\n' + rows.join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// API: NEWSLETTER (email sending)
// ═══════════════════════════════════════════════════════════════════════

// POST /api/newsletter/send — send newsletter to all subscribers (admin)
app.post('/api/newsletter/send', adminAuth, async (req, res) => {
  try {
    const { subject, body } = req.body;
    if (!subject || !body) {
      return res.status(400).json({ error: 'Тема и текст обязательны' });
    }

    const smtpHost = getSetting('smtp_host');
    const smtpPort = parseInt(getSetting('smtp_port')) || 587;
    const smtpUser = getSetting('smtp_user');
    const smtpPass = getSetting('smtp_pass');
    const smtpFrom = getSetting('smtp_from');

    if (!smtpUser || !smtpPass) {
      return res.status(400).json({ error: 'SMTP не настроен. Укажите email и пароль в настройках.' });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass }
    });

    const subscribers = db.prepare('SELECT email FROM subscribers').all();
    if (subscribers.length === 0) {
      return res.status(400).json({ error: 'Нет подписчиков для рассылки' });
    }

    let sentCount = 0;
    const errors = [];

    for (const sub of subscribers) {
      try {
        await transporter.sendMail({
          from: smtpFrom,
          to: sub.email,
          subject: subject,
          html: body
        });
        sentCount++;
      } catch (emailErr) {
        errors.push({ email: sub.email, error: emailErr.message });
      }
    }

    // Save to history
    db.prepare('INSERT INTO newsletters (subject, body, sent_to) VALUES (?, ?, ?)').run(subject, body, sentCount);

    res.json({
      message: `Рассылка отправлена: ${sentCount} из ${subscribers.length}`,
      sent: sentCount,
      total: subscribers.length,
      errors: errors
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/newsletter/history — newsletter history (admin)
app.get('/api/newsletter/history', adminAuth, (req, res) => {
  try {
    const history = db.prepare('SELECT id, subject, sent_to, sent_at FROM newsletters ORDER BY sent_at DESC').all();
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// API: SETTINGS (admin)
// ═══════════════════════════════════════════════════════════════════════

// GET /api/settings — get all settings (admin)
app.get('/api/settings', adminAuth, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM settings').all();
    const settings = {};
    rows.forEach(r => { settings[r.key] = r.value; });
    // Don't expose password in response
    delete settings.admin_password;
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/settings — update settings (admin)
app.put('/api/settings', adminAuth, (req, res) => {
  try {
    const allowed = ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from'];
    for (const [key, value] of Object.entries(req.body)) {
      if (allowed.includes(key)) {
        setSetting(key, value);
      }
    }
    res.json({ message: 'Настройки сохранены' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/settings/password — change admin password (admin)
app.put('/api/settings/password', adminAuth, (req, res) => {
  try {
    const { new_password } = req.body;
    if (!new_password || new_password.length < 4) {
      return res.status(400).json({ error: 'Пароль должен быть минимум 4 символа' });
    }
    setSetting('admin_password', new_password);
    res.json({ message: 'Пароль изменён' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/check — check admin password
app.post('/api/auth/check', (req, res) => {
  const { password } = req.body;
  const correctPassword = getSetting('admin_password');
  if (password === correctPassword) {
    res.json({ ok: true });
  } else {
    res.status(401).json({ ok: false, error: 'Неверный пароль' });
  }
});

// ─── Stats ───────────────────────────────────────────────────────────
app.get('/api/stats', adminAuth, (req, res) => {
  try {
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
    const inStock = db.prepare('SELECT COUNT(*) as count FROM products WHERE sold_out = 0').get().count;
    const soldOut = db.prepare('SELECT COUNT(*) as count FROM products WHERE sold_out = 1').get().count;
    const totalSubscribers = db.prepare('SELECT COUNT(*) as count FROM subscribers').get().count;
    const totalNewsletters = db.prepare('SELECT COUNT(*) as count FROM newsletters').get().count;
    res.json({ totalProducts, inStock, soldOut, totalSubscribers, totalNewsletters });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Fallback: serve HTML pages ──────────────────────────────────────
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, req.path);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.sendFile(filePath);
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

// ─── Start ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  ╔══════════════════════════════════════════╗`);
  console.log(`  ║  TrustTheHood Server                     ║`);
  console.log(`  ║  http://localhost:${PORT}                    ║`);
  console.log(`  ║  Admin: http://localhost:${PORT}/admin        ║`);
  console.log(`  ║  Пароль по умолчанию: admin123            ║`);
  console.log(`  ╚══════════════════════════════════════════╝\n`);
});
