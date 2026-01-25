/**
 * OGQ GRAFOLIO MVP - 로컬 서버
 * - 정적 파일 제공 (HTML, CSS, JS, 이미지)
 * - POST /api/record : 클릭한 버튼/입력값을 엑셀용 CSV에 기록
 *
 * 실행: npm run server  또는  node server.js
 * 접속: http://localhost:3000
 */

var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

var PORT = process.env.PORT || 3000;
var ROOT = path.join(__dirname);
var CSV_PATH = path.join(ROOT, 'data', 'commission_records.csv');
var CSV_HEADER = 'timestamp,artist,artistName,img,assetType,clientCount,exclusiveUse,requestNote';

function ensureDataDir() {
  var dir = path.dirname(CSV_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function csvEscape(val) {
  var s = String(val == null ? '' : val);
  if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function appendRecord(obj) {
  ensureDataDir();
  var row = [
    obj.timestamp,
    obj.artist,
    obj.artistName,
    obj.img,
    obj.assetType,
    obj.clientCount,
    obj.exclusiveUse,
    (obj.requestNote || '').replace(/\r?\n/g, ' ')
  ].map(csvEscape).join(',') + '\n';

  var exists = fs.existsSync(CSV_PATH);
  if (!exists) fs.writeFileSync(CSV_PATH, '\uFEFF' + CSV_HEADER + '\n', 'utf8'); // BOM for Excel
  fs.appendFileSync(CSV_PATH, row, 'utf8');
}

var MIMES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function send(res, status, body, contentType) {
  res.writeHead(status, { 'Content-Type': contentType || 'text/plain; charset=utf-8' });
  res.end(body);
}

function serveStatic(reqPath) {
  var p = path.join(ROOT, (reqPath || '/') === '/' ? 'index.html' : reqPath.replace(/^\//, ''));
  if (!p.startsWith(ROOT)) return null;
  if (!fs.existsSync(p) || !fs.statSync(p).isFile()) {
    if (!path.extname(p)) p = path.join(ROOT, 'index.html');
    if (!fs.existsSync(p)) return null;
  }
  return p;
}

var server = http.createServer(function (req, res) {
  var u = url.parse(req.url, true);
  var pathname = u.pathname;

  // OPTIONS /api/record — CORS 프리플라이트 (로컬/다른 포트에서 호출 허용)
  if (req.method === 'OPTIONS' && pathname === '/api/record') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  // POST /api/record — 엑셀(CSV) 기록
  if (req.method === 'POST' && pathname === '/api/record') {
    var body = '';
    req.on('data', function (chunk) { body += chunk; });
    req.on('end', function () {
      try {
        var data = JSON.parse(body || '{}');
        appendRecord(data);
        res.setHeader('Access-Control-Allow-Origin', '*');
        send(res, 200, JSON.stringify({ ok: true }), 'application/json; charset=utf-8');
      } catch (e) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        send(res, 400, JSON.stringify({ ok: false, error: String(e) }), 'application/json; charset=utf-8');
      }
    });
    return;
  }

  // GET — 정적 파일
  var file = serveStatic(pathname);
  if (!file) {
    send(res, 404, 'Not Found');
    return;
  }
  var ext = path.extname(file);
  var mime = MIMES[ext] || 'application/octet-stream';
  var stream = fs.createReadStream(file);
  stream.on('error', function () { send(res, 500, 'Error'); });
  res.writeHead(200, { 'Content-Type': mime });
  stream.pipe(res);
});

server.listen(PORT, function () {
  console.log('OGQ GRAFOLIO MVP: http://localhost:' + PORT);
  console.log('엑셀 기록 파일: ' + CSV_PATH);
});
