const http = require('http');

const port = Number(process.env.PORT || 3270);

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    sendJson(res, 200, { status: 'ok' });
    return;
  }

  if (req.method === 'GET' && (req.url === '/api/status' || req.url === '/status')) {
    sendJson(res, 200, {
      app: 'Pixel Art Editor',
      status: 'ok',
      database: {
        host: process.env.DB_HOST || 'db',
        name: process.env.DB_NAME || 'gb170'
      }
    });
    return;
  }

  sendJson(res, 404, { error: 'Not Found' });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`gb-170 backend listening on ${port}`);
});
