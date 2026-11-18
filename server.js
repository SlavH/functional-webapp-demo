/**
 * Functional Web App — reference REST backend (Node.js, zero dependencies).
 *
 * The index.html demo uses a localStorage-backed store so it runs on GitHub
 * Pages with no server. In production that Store interface maps 1:1 onto these
 * endpoints — swap the persistence layer, keep the UI. This is the "make it
 * back-end functional" part of a static-site-to-full-app clone.
 *
 * Run:  node server.js        (listens on http://localhost:3000)
 */
const http = require('http');

const PORT = process.env.PORT || 3000;
const db = {
  users: [{ id: 1, email: 'admin@demo.dev', password: 'demo123', role: 'admin', name: 'Demo Admin' }],
  items: [
    { id: 'i_1', title: 'Homepage hero refresh', category: 'Design', status: 'Done', owner: 'Asha' },
    { id: 'i_2', title: 'Contact form + validation', category: 'Backend', status: 'In Progress', owner: 'Ravi' }
  ],
  sessions: {}
};

function json(res, code, body) {
  res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(body));
}
function body(req) {
  return new Promise(resolve => {
    let data = '';
    req.on('data', c => data += c);
    req.on('end', () => { try { resolve(JSON.parse(data || '{}')); } catch { resolve({}); } });
  });
}
function token() { return 'tok_' + Math.random().toString(36).slice(2); }
function userFrom(req) {
  const t = (req.headers.authorization || '').replace('Bearer ', '');
  return db.sessions[t] || null;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const p = url.pathname;

  // --- Auth ---
  if (p === '/api/login' && req.method === 'POST') {
    const { email, password } = await body(req);
    const u = db.users.find(x => x.email === email && x.password === password);
    if (!u) return json(res, 401, { error: 'Invalid credentials' });
    const tok = token();
    db.sessions[tok] = { email: u.email, role: u.role, name: u.name };
    return json(res, 200, { token: tok, user: db.sessions[tok] });
  }
  if (p === '/api/logout' && req.method === 'POST') {
    const t = (req.headers.authorization || '').replace('Bearer ', '');
    delete db.sessions[t];
    return json(res, 200, { ok: true });
  }
  if (p === '/api/me' && req.method === 'GET') {
    const u = userFrom(req);
    return u ? json(res, 200, u) : json(res, 401, { error: 'Unauthorized' });
  }

  // --- CRUD (auth-protected) ---
  if (p === '/api/items' && req.method === 'GET') {
    if (!userFrom(req)) return json(res, 401, { error: 'Unauthorized' });
    return json(res, 200, db.items);
  }
  if (p === '/api/items' && req.method === 'POST') {
    if (!userFrom(req)) return json(res, 401, { error: 'Unauthorized' });
    const data = await body(req);
    const item = { id: 'i_' + Date.now(), ...data };
    db.items.unshift(item);
    return json(res, 201, item);
  }
  if (p.startsWith('/api/items/') && req.method === 'PUT') {
    if (!userFrom(req)) return json(res, 401, { error: 'Unauthorized' });
    const id = p.split('/')[3];
    const item = db.items.find(x => x.id === id);
    if (!item) return json(res, 404, { error: 'Not found' });
    Object.assign(item, await body(req));
    return json(res, 200, item);
  }
  if (p.startsWith('/api/items/') && req.method === 'DELETE') {
    if (!userFrom(req)) return json(res, 401, { error: 'Unauthorized' });
    const id = p.split('/')[3];
    db.items = db.items.filter(x => x.id !== id);
    return json(res, 200, { ok: true });
  }

  if (p === '/api/health') return json(res, 200, { status: 'ok', uptime: process.uptime() });
  return json(res, 404, { error: 'Not found' });
});

if (require.main === module) server.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
module.exports = server;
