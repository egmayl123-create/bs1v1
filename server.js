const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const STATE_FILE = path.join(ROOT, 'data', 'state.json');

function readState() {
  return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
}

function send(res, code, type, body) {
  res.writeHead(code, {
    'Content-Type': type,
    'Cache-Control': 'no-store, no-cache, must-revalidate'
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(requestUrl.pathname);

  // Public read-only API. Results are edited in data/state.json.
  if (pathname === '/api/state' && req.method === 'GET') {
    try {
      return send(res, 200, 'application/json; charset=utf-8', JSON.stringify(readState()));
    } catch (e) {
      console.error('Failed to read state.json:', e);
      return send(res, 500, 'application/json; charset=utf-8', JSON.stringify({ error: 'state' }));
    }
  }

  // There is intentionally no public API for changing tournament data.
  // A PUT/POST request cannot modify state on the live server.
  if (pathname === '/api/state' && req.method !== 'GET') {
    return send(res, 405, 'application/json; charset=utf-8', JSON.stringify({
      error: 'read_only',
      message: 'Tournament data is edited in data/state.json.'
    }));
  }

  let relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  if (relative === 'admin' || relative === 'admin/') relative = 'admin.html';

  const filePath = path.resolve(ROOT, relative);
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
    return send(res, 403, 'text/plain; charset=utf-8', 'Forbidden');
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    return send(res, 404, 'text/plain; charset=utf-8', 'Not found');
  }

  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
  };

  return send(res, 200, types[ext] || 'application/octet-stream', fs.readFileSync(filePath));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Tournament site listening on 0.0.0.0:${PORT}`);
});
