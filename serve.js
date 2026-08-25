// 手元で動かすための かんたんなサーバー。
//  ・静的ファイルを くばる
//  ・/api/* は Vercel と同じ handler を そのまま呼ぶ（記録は .devdata/ に たまります）
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = process.env.PORT ? Number(process.env.PORT) : 5179;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function shim(res) {
  res.status = function (code) { res._code = code; return res; };
  res.json = function (obj) {
    const text = JSON.stringify(obj);
    res.writeHead(res._code || 200, Object.assign({ "content-type": "application/json; charset=utf-8" }, res._extra || {}));
    res.end(text);
    return res;
  };
  const origSetHeader = res.setHeader.bind(res);
  res.setHeader = function (k, v) { origSetHeader(k, v); return res; };
  const origEnd = res.end.bind(res);
  res.end = function (d) {
    if (!res.headersSent) res.writeHead(res._code || 200);
    return origEnd(d);
  };
  return res;
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (c) => { raw += c; if (raw.length > 2e6) req.destroy(); });
    req.on("end", () => {
      try { resolve(raw ? JSON.parse(raw) : {}); } catch (e) { resolve({}); }
    });
  });
}

http.createServer(async (req, res) => {
  const url = req.url.split("?")[0];

  // かいはつ用：がめんを PNG で ほぞん（手元だけ）
  if (url === "/devshot" && req.method === "POST") {
    let raw = "";
    req.on("data", (c) => { raw += c; });
    req.on("end", () => {
      try {
        const d = JSON.parse(raw);
        const b64 = String(d.png).split(",").pop();
        fs.mkdirSync(path.join(ROOT, "shots"), { recursive: true });
        const file = path.join(ROOT, "shots", (d.name || "shot") + ".png");
        fs.writeFileSync(file, Buffer.from(b64, "base64"));
        res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify({ ok: true, file: file }));
      } catch (e) { res.writeHead(500).end(String(e)); }
    });
    return;
  }

  if (url.indexOf("/api/") === 0) {
    const name = url.slice(5).replace(/[^a-z0-9_-]/gi, "");
    const file = path.join(ROOT, "api", name + ".js");
    if (!fs.existsSync(file)) { res.writeHead(404, { "content-type": "application/json" }).end('{"error":"nohandler"}'); return; }
    try {
      delete require.cache[require.resolve(file)];   // 直したらすぐ反映されるように
      const handler = require(file);
      req.body = await readBody(req);
      await handler(req, shim(res));
    } catch (e) {
      console.error(e);
      if (!res.headersSent) res.writeHead(500, { "content-type": "application/json" }).end('{"error":"server"}');
    }
    return;
  }

  let rel = decodeURIComponent(url);
  if (rel === "/") rel = "/index.html";
  let clean = path.normalize(rel);
  while (clean.length && (clean[0] === "/" || clean.charCodeAt(0) === 92)) clean = clean.slice(1);
  const file = path.join(ROOT, clean);
  if (!file.startsWith(ROOT)) { res.writeHead(403).end("forbidden"); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { "content-type": "text/plain" }).end("not found"); return; }
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream", "cache-control": "no-store" });
    res.end(data);
  });
}).listen(PORT, "127.0.0.1", () => console.log("VORAZ MONSTERS  http://localhost:" + PORT));
