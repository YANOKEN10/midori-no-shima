// ============================================================
//  ひとの ドットえ（32よこ × 40たて・2とうしん）
//   もじ： 3 ふち / H かみ / K はだ / S ふく / P ズボン(スカート)
//          w しろ（めの ひかり）
//   h k s p は それぞれの かげ（右下がわ）で、あとから じどうで つけます。
//
//   かみがたと、スカートか ズボンかを えらべます。
//     hair: "short" みじかい / "long" ながい / "twin" ふたつむすび
//           "cap"   ぼうし   / "bald" うすい  / "spiky" とがった
//     skirt: true なら スカート
// ============================================================

const W = 32, HT = 40;
const HEAD_TOP = 4;    // あたまの てっぺん
const NECK = 22;       // くび
const HIP = 30;        // こし（ここから あし）
const FOOT = 35;       // あしの さき

function grid() { return Array.from({ length: HT }, () => new Array(W).fill(".")); }
function put(g, x, y, c) { x = Math.round(x); y = Math.round(y); if (x >= 0 && x < W && y >= 0 && y < HT) g[y][x] = c; }
function rect(g, x0, y0, w, h, c) { for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) put(g, x, y, c); }
function disc(g, cx, cy, rx, ry, c) {
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
    for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
      const dx = (x - cx) / rx, dy = (y - cy) / ry;
      if (dx * dx + dy * dy <= 1.03) put(g, x, y, c);
    }
}
function tri(g, x0, y0, w, h, up, c) {
  for (let j = 0; j < h; j++) {
    const ww = Math.max(1, Math.round(w * (1 - j / h)));
    const y = up ? y0 + j : y0 + h - 1 - j;
    for (let i = 0; i < ww; i++) put(g, x0 + i, y, c);
  }
}
function outline(g) {
  const o = g.map((r) => r.slice());
  for (let y = 0; y < HT; y++) for (let x = 0; x < W; x++) {
    if (g[y][x] !== ".") continue;
    const near = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => {
      const a = g[y + dy] && g[y + dy][x + dx];
      return a && a !== "." && a !== "3";
    });
    if (near) o[y][x] = "3";
  }
  return o;
}
function lines(g) { return g.map((r) => r.join("").replace(/\.+$/, "")); }

/* --- あし と こし（ズボン か スカート） --- */
function drawLegs(g, step, skirt, side) {
  if (side) {
    const f = step === 1 ? 2 : 0, b = step === 3 ? 2 : 0;
    if (skirt) {
      rect(g, 16 + f, HIP + 1, 4, 3, "K"); rect(g, 15 + f, FOOT, 6, 2, "3");
      rect(g, 13 - b, HIP + 1, 3, 2, "K"); rect(g, 12 - b, FOOT - 1, 5, 2, "3");
    } else {
      rect(g, 15 + f, HIP - 1, 5, 5, "P"); rect(g, 14 + f, FOOT, 7, 2, "3");
      rect(g, 13 - b, HIP - 1, 4, 4, "P"); rect(g, 12 - b, FOOT - 1, 6, 2, "3");
    }
    return;
  }
  const legs = [[11, step === 1 ? 1 : 0], [17, step === 3 ? 1 : 0]];
  for (const [x, dy] of legs) {
    if (skirt) {
      rect(g, x + 1, HIP + 1, 3, 3 - dy, "K");     // すらりとした あし
      rect(g, x, FOOT - dy, 5, 2, "3");
    } else {
      rect(g, x, HIP - 1, 4, 5 - dy, "P");
      rect(g, x - 1, FOOT - dy, 6, 2, "3");
    }
  }
}

/* --- どうたい --- */
function drawBody(g, step, skirt, side) {
  drawLegs(g, step, skirt, side);
  if (side) {
    rect(g, 11, NECK, 11, HIP - NECK, "S");
    disc(g, 16, NECK + 0.5, 5.5, 3, "S");
    if (skirt) { tri(g, 9, HIP - 4, 14, 6, true, "P"); rect(g, 9, HIP + 1, 14, 1, "P"); }
    else disc(g, 16, HIP - 1.5, 5.5, 2, "S");
    rect(g, 17, NECK + 1, 3, 5, "S"); rect(g, 17, NECK + 5, 3, 3, "K");
    rect(g, 14, NECK - 2, 4, 2, "K");
    return;
  }
  rect(g, 9, NECK, 14, HIP - NECK, "S");
  disc(g, 16, NECK + 0.5, 7, 3, "S");
  if (skirt) {
    // スカート（下ほど ひろがる）
    for (let j = 0; j < 6; j++) rect(g, 8 - j, HIP - 4 + j, 16 + j * 2, 1, "P");
    rect(g, 8 - 5, HIP + 1, 26, 1, "P");
  } else {
    disc(g, 16, HIP - 1.5, 7, 2, "S");
  }
  rect(g, 6, NECK + 1, 3, 5, "S"); rect(g, 23, NECK + 1, 3, 5, "S");
  rect(g, 6, NECK + 5, 3, 3, "K"); rect(g, 23, NECK + 5, 3, 3, "K");
  rect(g, 14, NECK - 2, 4, 2, "K");
}

/* --- かみがた --- */
// かおの ところを のこして あたまを かみで おおう
function hairCap(g, style, view) {
  const cx = view === "side" ? 15 : 16;
  const faceCX = view === "side" ? 19 : 16;
  const faceRX = view === "side" ? 6 : 8, faceRY = view === "side" ? 6.5 : 7;
  const faceCY = 15.5;
  for (let y = HEAD_TOP - 2; y <= 22; y++) {
    for (let x = 4; x <= 27; x++) {
      const dx = (x - cx) / (view === "side" ? 10 : 10.5), dy = (y - 12.5) / 10;
      if (dx * dx + dy * dy > 1.03) continue;
      if (view !== "back") {
        const fx = (x - faceCX) / faceRX, fy = (y - faceCY) / faceRY;
        if (fx * fx + fy * fy <= 1.0) continue;                 // かおは のこす
      }
      if (style === "bald" && y < 13) continue;                 // うすい かみ
      put(g, x, y, "H");
    }
  }
}
function drawHair(g, style, view) {
  hairCap(g, style, view);
  if (style === "long") {
    // ながい かみ（りょうがわに たらす）
    if (view === "side") { disc(g, 11, 22, 5, 8, "H"); }
    else {
      disc(g, 7, 21, 3.5, 8, "H"); disc(g, 25, 21, 3.5, 8, "H");
      if (view === "back") rect(g, 8, 14, 16, 12, "H");
    }
  } else if (style === "twin") {
    if (view === "side") disc(g, 9, 17, 4, 4, "H");
    else { disc(g, 5, 18, 4, 4.5, "H"); disc(g, 27, 18, 4, 4.5, "H"); }
  } else if (style === "spiky") {
    for (const [x, w, h] of [[6, 4, 5], [11, 4, 6], [17, 4, 6], [22, 4, 5]]) tri(g, x, HEAD_TOP - 5, w, h, false, "H");
  } else if (style === "cap") {
    // ぼうし（ふくと おなじ 色）
    for (let y = HEAD_TOP - 3; y <= 12; y++) {
      for (let x = 4; x <= 27; x++) {
        const dx = (x - 16) / 11, dy = (y - 12.5) / 10.5;
        if (dx * dx + dy * dy <= 1.03) put(g, x, y, "S");
      }
    }
    if (view !== "back") rect(g, 6, 12, 20, 2, "S");            // つば
    rect(g, 4, 11, 24, 1, "3");
  }
}

/* --- かお --- */
function drawFace(g, view) {
  if (view === "back") return;
  if (view === "side") {
    rect(g, 19, 15, 3, 3, "3"); put(g, 19, 15, "w"); put(g, 21, 17, "3");
    put(g, 23, 19, "3"); put(g, 22, 20, "3");
    return;
  }
  rect(g, 11, 15, 3, 3, "3"); rect(g, 18, 15, 3, 3, "3");
  put(g, 11, 15, "w"); put(g, 18, 15, "w");
  put(g, 13, 17, "3"); put(g, 20, 17, "3");
  put(g, 15, 20, "3"); put(g, 16, 20, "3"); put(g, 14, 19, "3"); put(g, 17, 19, "3");
}

function frame(view, step, style) {
  const g = grid();
  const skirt = Boolean(style && style.skirt);
  drawBody(g, step, skirt, view === "side");
  disc(g, view === "side" ? 16 : 16, 13, view === "side" ? 9.5 : 10, 9.5, "K");   // あたま
  drawHair(g, (style && style.hair) || "short", view);
  drawFace(g, view);
  return outline(g);
}

/* --- 右下がわに かげを つける（ひかりは 左上から） --- */
const SHADE = { H: "h", K: "k", S: "s", P: "p" };
function shadeRows(rows) {
  const h = rows.length, w = rows.reduce((m, r) => Math.max(m, r.length), 0);
  const pad = rows.map((r) => (r + " ".repeat(w)).slice(0, w).replace(/ /g, "."));
  const g = pad.map((r) => r.split(""));
  const at = (x, y) => (x >= 0 && x < w && y >= 0 && y < h ? pad[y][x] : ".");
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const c = pad[y][x];
      const sh = SHADE[c];
      if (!sh) continue;
      const r = at(x + 1, y), d = at(x, y + 1);
      if (r === "." || r === "3" || d === "." || d === "3") g[y][x] = sh;
      else if ((c === "S" || c === "P") && (x + y) % 2 === 0 && x > w * 0.55) g[y][x] = sh;
    }
  }
  return g.map((r) => r.join(""));
}
function flipRows(rows) {
  const w = rows.reduce((m, r) => Math.max(m, r.length), 0);
  return rows.map((r) => (r + ".".repeat(w)).slice(0, w).split("").reverse().join(""));
}

/* --- できあがった え（かみがた・スカートごとに おぼえておく） --- */
const rawCache = new Map();
export function personFramesRaw(style) {
  const st = style || {};
  const key = (st.hair || "short") + (st.skirt ? "+skirt" : "");
  if (rawCache.has(key)) return rawCache.get(key);
  const mk = (view, step) => shadeRows(lines(frame(view, step, st)));
  const side = [mk("side", 0), mk("side", 1), mk("side", 0), mk("side", 3)];
  const out = {
    down: [mk("front", 0), mk("front", 1), mk("front", 0), mk("front", 3)],
    up: [mk("back", 0), mk("back", 1), mk("back", 0), mk("back", 3)],
    right: side,
    left: side.map(flipRows),
  };
  rawCache.set(key, out);
  return out;
}

// 4色の いろセット用（白黒モードなど）：もじを 0〜3の こさに おきかえる
export function personFrames(colors, style) {
  const c = {
    H: String(colors.H == null ? 3 : colors.H),
    K: String(colors.K == null ? 0 : colors.K),
    S: String(colors.S == null ? 1 : colors.S),
    P: String(colors.P == null ? 2 : colors.P),
  };
  const map = (r) => r
    .replace(/[Hh]/g, c.H).replace(/[Kk]/g, c.K)
    .replace(/[Ss]/g, c.S).replace(/[Pp]/g, c.P)
    .replace(/w/g, "0");
  const raw = personFramesRaw(style);
  const out = {};
  for (const dir of ["down", "up", "right", "left"]) out[dir] = raw[dir].map((rows) => rows.map(map));
  return out;
}

// よく つかう みため（いろの ばんごうと、かみがた・スカート）
export const LOOKS = {
  player: { H: 3, K: 0, S: 2, P: 3, hair: "short" },
  rival: { H: 2, K: 0, S: 3, P: 2, hair: "spiky" },
  prof: { H: 0, K: 0, S: 0, P: 3, hair: "bald" },
  boy: { H: 3, K: 0, S: 2, P: 3, hair: "short" },
  girl: { H: 2, K: 0, S: 3, P: 2, hair: "long", skirt: true },
  oldman: { H: 0, K: 0, S: 1, P: 2, hair: "bald" },
  nurse: { H: 2, K: 0, S: 1, P: 2, hair: "twin", skirt: true },
  clerk: { H: 3, K: 0, S: 1, P: 2, hair: "cap" },
  sailor: { H: 3, K: 0, S: 1, P: 2, hair: "cap" },
  hiker: { H: 3, K: 0, S: 1, P: 2, hair: "cap" },
  leader1: { H: 1, K: 0, S: 1, P: 2, hair: "long", skirt: true },
  leader2: { H: 3, K: 0, S: 1, P: 2, hair: "spiky" },
  philoa: { H: 1, K: 0, S: 2, P: 3, hair: "spiky" },
};

// みための なまえから かみがた・スカートを とりだす
export function styleOf(look) {
  const L = LOOKS[look] || LOOKS.boy;
  return { hair: L.hair || "short", skirt: Boolean(L.skirt) };
}
