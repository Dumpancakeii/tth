const http = require('http');
http.get('http://localhost:3001/api/products', (r) => {
  let d = '';
  r.on('data', c => d += c);
  r.on('end', () => {
    const arr = JSON.parse(d);
    console.log('Server OK! Products:', arr.length);
  });
}).on('error', e => console.log('Server DOWN:', e.message));
