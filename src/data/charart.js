// ============================================================
//  ひとの ドットえ（32よこ × 40たて・2とうしん）
//   もじ： 3 ふち / H かみ / K はだ / S ふく / P ズボン(スカート) / T ぼうし
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
    // よこむき：まえの あしが 前へ、うしろの あしが 後ろへ
    const f = step === 1 ? 3 : step === 3 ? 0 : 1;       // まえ足の 出かた
    const b = step === 1 ? 0 : step === 3 ? 3 : 1;       // うしろ足の 引きかた
    if (skirt) {
      rect(g, 15 + f, HIP + 1, 4, 3, "K"); rect(g, 14 + f, FOOT, 6, 2, "3");
      rect(g, 14 - b, HIP + 1, 3, 2, "K"); rect(g, 13 - b, FOOT - 1, 5, 2, "3");
    } else {
      rect(g, 14 - b, HIP - 1, 4, 4, "P"); rect(g, 13 - b, FOOT - 1, 6, 2, "3");   // おくの あし
      rect(g, 15 + f, HIP - 1, 5, 5, "P"); rect(g, 14 + f, FOOT, 7, 2, "3");       // てまえの あし
    }
    return;
  }
  // step 0 = 立つ / 1 = ひだり足を まえに / 3 = みぎ足を まえに
  const fwd = step === 1 ? 0 : step === 3 ? 1 : -1;
  const xs = [11, 17];
  for (let i = 0; i < 2; i++) {
    const x = xs[i];
    const isFwd = (fwd === i), isBack = (fwd >= 0 && fwd !== i);
    const out = isFwd ? (i === 0 ? -1 : 1) : 0;          // まえの あしは そとに ひらく
    const top = HIP - 1 + (isBack ? 1 : 0);
    const len = isFwd ? 6 : isBack ? 4 : 5;
    if (skirt) {
      rect(g, x + 1 + out, HIP + 1 + (isBack ? 1 : 0), 3, isFwd ? 4 : isBack ? 2 : 3, "K");
      rect(g, x + out, FOOT + (isFwd ? 1 : isBack ? -1 : 0), 5, 2, "3");
    } else {
      rect(g, x + out, top, 4, len, "P");
      rect(g, x - 1 + out, top + len, 6, 2, "3");         // くつ
      rect(g, x - 1 + out, top + len + 1, 6, 1, "3");
    }
  }
}

/* --- どうたい --- */
function drawBody(g, step, skirt, side, coat) {
  drawLegs(g, step, skirt, side);
  if (side) {
    rect(g, 11, NECK, 11, HIP - NECK, "S");
    disc(g, 16, NECK + 0.5, 5.5, 3, "S");
    if (skirt) { tri(g, 9, HIP - 4, 14, 6, true, "P"); rect(g, 9, HIP + 1, 14, 1, "P"); }
    else disc(g, 16, HIP - 1.5, 5.5, 2, "S");
    rect(g, 17, NECK + 1, 3, 5, "S"); rect(g, 17, NECK + 5, 3, 3, "K");
    rect(g, 14, NECK - 2, 4, 2, "K");
    if (coat) { rect(g, 11, NECK, 5, HIP - NECK + 3, "C"); rect(g, 19, NECK, 3, HIP - NECK + 3, "C"); }
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
  if (coat) {
    // はくい（まえが ひらいた 白い うわぎ）
    rect(g, 8, NECK, 5, HIP - NECK + 3, "C"); rect(g, 19, NECK, 5, HIP - NECK + 3, "C");
    rect(g, 5, NECK + 1, 4, 7, "C"); rect(g, 23, NECK + 1, 4, 7, "C");
    rect(g, 8, NECK, 16, 2, "C");
    rect(g, 12, NECK, 2, 4, "3"); rect(g, 18, NECK, 2, 4, "3");   // えり
  }
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
// かみの ある ところ だけに 線を 引く（かおに かからない ように）
function hairLine(g, x0, y, w) {
  for (let x = x0; x < x0 + w; x++) {
    const cur = g[y] && g[y][x];
    if (cur === "H" || cur === "h") put(g, x, y, "3");
  }
}
function drawHair(g, style, view, bangs) {
  const bare = (style === "mohican" || style === "twoblock");
  if (!bare) hairCap(g, style, view);

  if (style === "long") {
    if (view === "side") { disc(g, 11, 22, 5, 8, "H"); }
    else {
      disc(g, 7, 21, 3.5, 8, "H"); disc(g, 25, 21, 3.5, 8, "H");
      if (view === "back") rect(g, 8, 14, 16, 12, "H");
    }
  } else if (style === "twin") {
    if (view === "side") disc(g, 9, 17, 4, 4, "H");
    else { disc(g, 5, 18, 4, 4.5, "H"); disc(g, 27, 18, 4, 4.5, "H"); }
  } else if (style === "twintail") {
    // ツインテール（ながく たらす 2本）
    if (view === "side") { disc(g, 9, 16, 3.5, 3.5, "H"); disc(g, 8, 24, 3, 6, "H"); }
    else {
      disc(g, 4, 16, 3, 3, "H"); disc(g, 28, 16, 3, 3, "H");
      disc(g, 3, 24, 2.5, 6, "H"); disc(g, 29, 24, 2.5, 6, "H");
    }
  } else if (style === "spiky") {
    for (const [x, w, h] of [[6, 4, 5], [11, 4, 6], [17, 4, 6], [22, 4, 5]]) tri(g, x, HEAD_TOP - 5, w, h, false, "H");
  } else if (style === "twinspike") {
    // ツイスパ（左右に はねた 2つの とがり）
    tri(g, 2, HEAD_TOP - 4, 6, 7, false, "H");
    tri(g, 24, HEAD_TOP - 4, 6, 7, false, "H");
    rect(g, 8, HEAD_TOP - 2, 16, 4, "H");
  } else if (style === "mohican") {
    // モヒカン（まん中の すじ だけ 立てる。よこは そりあげ）
    const w = view === "side" ? 12 : 6;
    const x0 = view === "side" ? 10 : 13;
    // まん中の すじ（ひたいまで つづく）
    for (let y = HEAD_TOP - 4; y <= 14; y++) {
      const nx = (y > 11) ? w - 2 : w;
      rect(g, x0 + (w - nx) / 2, y, nx, 1, "H");
    }
    for (let i = 0; i < w; i += 2) rect(g, x0 + i, HEAD_TOP - 7, 1, 4, "H");   // とがり
    // そりあげた ところは かみの かげ色で うっすら
    for (let y = 8; y <= 13; y++) for (let x = 6; x <= 25; x++) {
      const dx = (x - 16) / 10.5, dy = (y - 12.5) / 10;
      if (dx * dx + dy * dy > 1.03) continue;
      if (x >= x0 - 1 && x < x0 + w + 1) continue;
      if ((x + y) % 2 === 0) put(g, x, y, "h");
    }
  } else if (style === "twoblock") {
    // ツーブロック（よこは かりあげ、上は のこす）
    for (let y = HEAD_TOP - 2; y <= 13; y++) for (let x = 5; x <= 26; x++) {
      const dx = (x - 16) / 10.5, dy = (y - 12.5) / 10;
      if (dx * dx + dy * dy <= 1.03) put(g, x, y, "H");
    }
    rect(g, 6, 13, 4, 3, "H"); rect(g, 22, 13, 4, 3, "H");
    hairLine(g, 5, 13, 22);
  } else if (style === "pony") {
    if (view === "side") { disc(g, 8, 20, 3.5, 7, "H"); rect(g, 7, 13, 4, 4, "H"); }
    else if (view === "back") { disc(g, 16, 24, 4, 8, "H"); rect(g, 13, 12, 7, 6, "H"); }
    else { disc(g, 4, 19, 2.5, 5, "H"); disc(g, 28, 19, 2.5, 5, "H"); }
  } else if (style === "bun") {
    disc(g, 9, HEAD_TOP - 2, 4, 3.5, "H");
    disc(g, 23, HEAD_TOP - 2, 4, 3.5, "H");
  } else if (style === "bob") {
    rect(g, 5, 18, 5, 5, "H"); rect(g, 22, 18, 5, 5, "H");
  } else if (style === "bobshort") {
    // ボブショート（あごの 上で そろえる）
    rect(g, 5, 17, 5, 4, "H"); rect(g, 22, 17, 5, 4, "H");
    hairLine(g, 5, 20, 22);
  } else if (style === "techno") {
    // テクノカット（よこは みじかく そろえ、まっすぐ）
    rect(g, 5, 12, 4, 7, "H"); rect(g, 23, 12, 4, 7, "H");
    hairLine(g, 5, 18, 22);
  } else if (style === "center") {
    // センターパート（まん中で わけて 両がわに ながす）
    // わけめは はだを 出さず、かみの かげ色で すじを 入れる
    if (view !== "back") rect(g, 15, HEAD_TOP - 1, 2, 7, "h");
    rect(g, 6, 10, 6, 8, "H"); rect(g, 20, 10, 6, 8, "H");
    rect(g, 12, HEAD_TOP - 1, 3, 5, "H"); rect(g, 17, HEAD_TOP - 1, 3, 5, "H");
  } else if (style === "mush") {
    // マッシュ（まるく そろえた きのこ あたま）
    for (let y = HEAD_TOP - 3; y <= 15; y++) for (let x = 4; x <= 27; x++) {
      const dx = (x - 16) / 11.5, dy = (y - 11) / 10.5;
      if (dx * dx + dy * dy <= 1.03) put(g, x, y, "H");
    }
    hairLine(g, 4, 15, 24);
  } else if (style === "straw") {
    for (let y = HEAD_TOP - 4; y <= 11; y++) {
      for (let x = 1; x <= 30; x++) {
        const dx = (x - 16) / 12, dy = (y - 11) / 9;
        if (dx * dx + dy * dy <= 1.03) put(g, x, y, "T");
      }
    }
    rect(g, 1, 11, 30, 3, "T");
    rect(g, 1, 14, 30, 1, "3");
    for (let x = 6; x <= 25; x += 4) rect(g, x, 8, 2, 1, "3");
  } else if (style === "profhat") {
    // はかせの ハット（つばの ある ぼうし）
    for (let y = HEAD_TOP - 5; y <= 10; y++) {
      for (let x = 6; x <= 25; x++) {
        const dx = (x - 16) / 9, dy = (y - 10) / 8;
        if (dx * dx + dy * dy <= 1.03) put(g, x, y, "T");
      }
    }
    rect(g, 2, 10, 28, 3, "T");                                   // ひろい つば
    rect(g, 2, 13, 28, 1, "3");
    rect(g, 7, 7, 18, 2, "3");                                    // リボン
  } else if (style === "beanie") {
    for (let y = HEAD_TOP - 3; y <= 13; y++) {
      for (let x = 4; x <= 27; x++) {
        const dx = (x - 16) / 11, dy = (y - 12.5) / 10.5;
        if (dx * dx + dy * dy <= 1.03) put(g, x, y, "S");
      }
    }
    rect(g, 5, 12, 22, 3, "S"); rect(g, 5, 14, 22, 1, "3");
    disc(g, 16, HEAD_TOP - 4, 3, 2.5, "S");
  } else if (style === "cap") {
    for (let y = HEAD_TOP - 3; y <= 12; y++) {
      for (let x = 4; x <= 27; x++) {
        const dx = (x - 16) / 11, dy = (y - 12.5) / 10.5;
        if (dx * dx + dy * dy <= 1.03) put(g, x, y, "S");
      }
    }
    if (view !== "back") rect(g, 6, 12, 20, 2, "S");
    hairLine(g, 4, 11, 24);
  }

  /* --- まえがみ（目の 上まで おろす） --- */
  if (view === "back" || !bangs) return;
  const hatStyle = (style === "cap" || style === "straw" || style === "beanie" || style === "profhat");
  if (hatStyle) return;
  const x0 = view === "side" ? 12 : 7, x1 = view === "side" ? 25 : 24;
  if (bangs === "blunt") {                       // パッツン
    rect(g, x0, 8, x1 - x0 + 1, 5, "H");
    rect(g, x0, 12, x1 - x0 + 1, 1, "h");
  } else if (bangs === "seven") {                // 七三
    for (let i = 0; i <= x1 - x0; i++) {
      const h = 6 - Math.round(i * 4 / (x1 - x0));
      rect(g, x0 + i, 8, 1, Math.max(2, h), "H");
    }
    rect(g, x0, 8, 4, 7, "H");
  } else if (bangs === "mush") {                 // マッシュ（まるく）
    for (let i = 0; i <= x1 - x0; i++) {
      const t = (i / (x1 - x0)) * 2 - 1;
      const h = Math.round(7 - t * t * 3);
      rect(g, x0 + i, 8, 1, h, "H");
    }
  } else if (bangs === "center") {               // センター分け
    for (let i = 0; i <= x1 - x0; i++) {
      const t = Math.abs((i / (x1 - x0)) * 2 - 1);
      const h = Math.round(2 + t * 5);
      rect(g, x0 + i, 8, 1, h, "H");
    }
  }
}

/* --- かお --- */
// はだの ところにだけ のせる（まえがみの 上には かかない）
function onSkin(g, x, y, c) {
  const cur = g[y] && g[y][x];
  if (cur === "K" || cur === "k") put(g, x, y, c);
}
function drawFace(g, view, boy) {
  if (view === "back") return;
  if (view === "side") {
    for (let j = 0; j < 3; j++) for (let i = 0; i < 2; i++) onSkin(g, 19 + i, 16 + j, "3");
    onSkin(g, 19, 16, "w");
    for (let i = 0; i < 4; i++) onSkin(g, 18 + i, 14, "3");      // まゆげ
    if (boy) { for (let i = 0; i < 3; i++) onSkin(g, 21 + i, 21, "3"); }
    else { onSkin(g, 22, 21, "3"); onSkin(g, 23, 20, "3"); }
    return;
  }
  // め（たて長・しろい ひかり入り）
  for (let j = 0; j < 3; j++) for (let i = 0; i < 2; i++) {
    onSkin(g, 11 + i, 16 + j, "3"); onSkin(g, 19 + i, 16 + j, "3");
  }
  onSkin(g, 11, 16, "w"); onSkin(g, 19, 16, "w");
  // まゆげ（男の子は ふとく きりっと、女の子は ほそく やわらかく）
  if (boy) {
    for (let i = 0; i < 4; i++) { onSkin(g, 10 + i, 14, "3"); onSkin(g, 18 + i, 14, "3"); }
    onSkin(g, 10, 13, "3"); onSkin(g, 21, 13, "3");
  } else {
    for (let i = 0; i < 3; i++) { onSkin(g, 11 + i, 14, "3"); onSkin(g, 19 + i, 14, "3"); }
  }
  // くち
  if (boy) {
    for (let i = 0; i < 4; i++) onSkin(g, 14 + i, 21, "3");
  } else {
    onSkin(g, 15, 21, "3"); onSkin(g, 16, 21, "3");
    onSkin(g, 14, 20, "3"); onSkin(g, 17, 20, "3");
  }
}

function bob(rows, up) {
  if (!up) return rows;
  const out = rows.slice(1);
  out.push(".".repeat(rows[0].length));
  return out;
}

function frame(view, step, style) {
  const st = style || {};
  const g = grid();
  drawBody(g, step, Boolean(st.skirt), view === "side", Boolean(st.coat));
  disc(g, 16, 13, view === "side" ? 9.5 : 10, 9.5, "K");         // あたま
  drawHair(g, st.hair || "short", view, st.bangs || "");
  drawFace(g, view, st.face !== "girl" && !st.skirt);
  return outline(g);
}

/* --- 右下がわに かげを つける（ひかりは 左上から） --- */
const SHADE = { H: "h", K: "k", S: "s", P: "p", T: "t", C: "c" };
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
  const key = (st.hair || "short") + "/" + (st.bangs || "-") + (st.skirt ? "+skirt" : "") + (st.coat ? "+coat" : "") + (st.face || "");
  if (rawCache.has(key)) return rawCache.get(key);
  const mk = (view, step) => shadeRows(bob(lines(frame(view, step, st)), step === 1 || step === 3));
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
    .replace(/[Ss]/g, c.S).replace(/[Pp]/g, c.P).replace(/[Tt]/g, c.S).replace(/[Cc]/g, "0")
    .replace(/w/g, "0");
  const raw = personFramesRaw(style);
  const out = {};
  for (const dir of ["down", "up", "right", "left"]) out[dir] = raw[dir].map((rows) => rows.map(map));
  return out;
}

// よく つかう みため（いろの ばんごうと、かみがた・スカート）
export const LOOKS = {
  player: { H: 3, K: 0, S: 2, P: 3, hair: "short", bangs: "seven" },
  rival: { H: 2, K: 0, S: 3, P: 2, hair: "twinspike", bangs: "center" },
  prof: { H: 0, K: 0, S: 0, P: 3, hair: "profhat", coat: true },
  boy: { H: 3, K: 0, S: 2, P: 3, hair: "mush", bangs: "mush" },
  girl: { H: 2, K: 0, S: 3, P: 2, hair: "twintail", bangs: "blunt", skirt: true },
  oldman: { H: 0, K: 0, S: 1, P: 2, hair: "bald" },
  nurse: { H: 2, K: 0, S: 1, P: 2, hair: "bobshort", bangs: "blunt", skirt: true },
  clerk: { H: 3, K: 0, S: 1, P: 2, hair: "cap" },
  sailor: { H: 3, K: 0, S: 1, P: 2, hair: "cap" },
  hiker: { H: 3, K: 0, S: 1, P: 2, hair: "beanie" },
  leader1: { H: 1, K: 0, S: 1, P: 2, hair: "bun", bangs: "center", skirt: true },
  leader2: { H: 3, K: 0, S: 1, P: 2, hair: "twoblock", bangs: "seven" },
  philoa: { H: 1, K: 0, S: 2, P: 3, hair: "twinspike", bangs: "center" },
};

// みための なまえから かみがた・スカートを とりだす
export function styleOf(look) {
  const L = LOOKS[look] || LOOKS.boy;
  return { hair: L.hair || "short", bangs: L.bangs || "", skirt: Boolean(L.skirt),
           coat: Boolean(L.coat), face: L.face || (L.skirt ? "girl" : "boy") };
}
