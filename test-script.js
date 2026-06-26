const http = require('http');
http.get('http://localhost:3000/api/image-proxy?url=https%3A%2F%2Fpub-9ca9f8ba8c9d47518d53ef4b3818ed26.r2.dev%2Fareasocial_residencia-ninhoverce%2Fcover.png&w=1200&q=80', (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log('STATUS:', res.statusCode, 'BODY:', data));
});
