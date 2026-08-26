// ============================================================
//  えがく どうぐ
//   ・画面は 320x288（ゲームボーイの ちょうど2ばい）
//   ・ゲームボーイカラーと おなじ かんがえかた：
//      え は 4だんかいの こさ（0=あかるい … 3=いちばん こい）で かき、
//      「どの いろセットで ぬるか」を ものごとに 切りかえます。
//   ・G.use("water") のように セットを えらんでから えがきます。
// ============================================================
export const W = 320, H = 288;
export const TILE = 32;          // マス1つの 大きさ（画面のドット）
export const ART = 16;           // え1マスの ドット数（2ばいに ひきのばす）

/* --- いろセット（4色ずつ） ------------------------------------- */
export const SETS = {
  // まわりの けしき
  grass:   ["#b8e070", "#7cc04c", "#3f8a34", "#1c4420"],
  path:    ["#f0dfae", "#d9bd82", "#a8834c", "#5a4325"],
  sand:    ["#f7e9b8", "#e0cd8a", "#b49a5c", "#6a5730"],
  tree:    ["#8fd45f", "#3f9e46", "#1f6b31", "#0e3418"],
  tallgrass:["#8ad066", "#4ba33e", "#26702a", "#0f3414"],
  rock:    ["#d2ccbb", "#9d9484", "#6a6154", "#332d26"],
  water:   ["#9fdcf7", "#4aa8e8", "#1f5fb0", "#0b2a55"],
  ledge:   ["#e6d3a2", "#b99a63", "#8a6a3c", "#432f18"],
  fence:   ["#e0d2b0", "#b09068", "#7a5c38", "#33240f"],

  // たてもの
  roof:    ["#f79a76", "#e05a44", "#9d2a24", "#3c0e10"],
  roofBlue:["#8fc8f0", "#4d84cc", "#27508c", "#0e2244"],
  wall:    ["#faeddb", "#dcc2a2", "#a8825b", "#4a3320"],
  door:    ["#e0b878", "#a87840", "#6c4a22", "#2e1c0c"],
  sign:    ["#f2dfae", "#c69a5c", "#8a6234", "#33210f"],

  // ほらあな・おくない
  cave:    ["#b9b0a0", "#877e6f", "#544c42", "#241f1a"],
  floor:   ["#fbf3e3", "#e2d3ba", "#b0906a", "#4a3a28"],
  carpet:  ["#f6bcc6", "#dd7d92", "#a04a63", "#3f1a2a"],
  wood:    ["#e6c08a", "#bb8b52", "#825c2f", "#331f0e"],
  machine: ["#e8f0f8", "#a8c0d8", "#5c7a9c", "#22303f"],
  plant:   ["#bfe884", "#5fae4c", "#2f7332", "#123818"],

  // ひと
  player:  ["#ffd9ae", "#e34b4b", "#2f4fa8", "#231a14"],
  rival:   ["#ffd9ae", "#7a4fc0", "#33305e", "#1a1626"],
  prof:    ["#ffd9ae", "#f4f4f4", "#9aa2ad", "#2a2a2e"],
  boy:     ["#ffd9ae", "#4fb0e0", "#2b5a7a", "#1b2630"],
  girl:    ["#ffd9ae", "#f279b0", "#a03a6a", "#2c1526"],
  oldman:  ["#ffd9ae", "#cfd6dd", "#7a8590", "#2a2e33"],
  nurse:   ["#ffd9ae", "#ffffff", "#e05a6a", "#33161c"],
  clerk:   ["#ffd9ae", "#8fd8a0", "#2f7a56", "#153224"],
  sailor:  ["#ffd9ae", "#f0f0f0", "#2f5fa8", "#152238"],
  hiker:   ["#ffd9ae", "#d8a84c", "#7a5320", "#2c1c0a"],
  philoa:  ["#ffd9ae", "#3aa8e8", "#eaf6ff", "#12283f"],
  leader1: ["#ffd9ae", "#5fc8e8", "#1f5f9c", "#0c2338"],
  leader2: ["#ffd9ae", "#f07840", "#a03410", "#331004"],

  // モンスター（タイプごと）
  ノーマル: ["#f6e6cb", "#cfa87f", "#8d6a48", "#33241a"],
  くさ:     ["#dbf5a2", "#77c94a", "#2f8038", "#123318"],
  ほのお:   ["#ffd9a0", "#f7893a", "#c03c12", "#3d1104"],
  みず:     ["#c2e9ff", "#54a6f0", "#1f5cae", "#0b2445"],
  でんき:   ["#fff2a8", "#f7d233", "#b98a08", "#3d2c04"],
  じめん:   ["#eddbb0", "#c39a5e", "#83592a", "#301c0a"],
  むし:     ["#e6f4a8", "#a8c94a", "#5f7a22", "#22300c"],
  やみ:     ["#d5c6ee", "#8f6cc8", "#523382", "#1d1030"],

  // タイプの 中でも 見た目が かぶらないように いろちがいを 用意
  "くさ2":   ["#b6f0d0", "#49bf8c", "#1d7358", "#0b2e26"],
  "くさ3":   ["#f0f7a0", "#a8cf3c", "#5f8010", "#243006"],
  "ほのお2": ["#ffc0b0", "#e8503c", "#a01818", "#3a0808"],
  "ほのお3": ["#ffd8b0", "#d08a3c", "#8a4a10", "#301a06"],
  "みず2":   ["#a8c8ff", "#4a68d8", "#20308c", "#0a1030"],
  "みず3":   ["#b8f8f0", "#3cc8c0", "#177a78", "#062c2c"],
  "でんき2": ["#ffe8b0", "#e8a828", "#9a6208", "#332004"],
  "でんき3": ["#fbfbd8", "#e0e070", "#9a9a20", "#303008"],
  "じめん2": ["#f0c8a8", "#c07848", "#7a4018", "#2c1406"],
  "じめん3": ["#e4e0d0", "#b0a888", "#6c6448", "#2a2618"],
  "むし2":   ["#d8e8a0", "#8aa838", "#4c6010", "#1c2406"],
  "むし3":   ["#c8f8d8", "#68c888", "#2c7848", "#0c2c18"],
  "やみ2":   ["#c0c0f0", "#6060c0", "#302878", "#100c28"],
  "やみ3":   ["#f0c0e8", "#c060b0", "#7a2068", "#2c0824"],
  "ノーマル2":["#f0f0f0", "#c0c0c0", "#808080", "#282828"],
  "ノーマル3":["#ffe8e0", "#e0b0a0", "#a07060", "#382820"],
  flower:  ["#ffffff", "#ffd45c", "#e8506a", "#5a1428"],
  book:    ["#f4f0e0", "#4f8fd0", "#c04a3a", "#2a1c14"],

  // がめん・わく
  ui:      ["#ffffff", "#dfe4ee", "#7f8ba3", "#1b2230"],
  uiDark:  ["#e6ebf5", "#a9b4c6", "#4f5b73", "#141a26"],
  title:   ["#ffe9a8", "#f7b23a", "#c04a2a", "#2a1030"],
  sky:     ["#cdeeff", "#8fd0f5", "#4f9ad8", "#1d3f66"],
  battleBg:["#e8f6c8", "#bfe38a", "#7fb25a", "#2f5a2a"],
};

// ゲームボーイ（1色）で あそびたい人むけ
const MONO = {
  green: ["#9bbc0f", "#8bac0f", "#306230", "#0f380f"],
  gray:  ["#e8e8d8", "#a8a898", "#585848", "#181810"],
};

let mode = "color";              // "color" | "green" | "gray"
let curSet = "ui";
export let PAL = SETS.ui;

export function resolve(setName) {
  if (mode !== "color") return MONO[mode] || MONO.green;
  return SETS[setName] || SETS.ui;
}

// これから えがく ものの いろセットを えらぶ（まえの セットを かえす）
export function use(setName) {
  const prev = curSet;
  curSet = setName || "ui";
  PAL = resolve(curSet);
  return prev;
}
export function currentSet() { return curSet; }

export function setPalette(name) {
  if (name !== "color" && !MONO[name]) return;
  mode = name;
  PAL = resolve(curSet);
  tileCache.clear();
  spriteCache.clear();
  if (houseCacheHook) houseCacheHook();
  document.body.style.background = mode === "color" ? "#141a26" : shade(MONO[mode][3], -0.35);
}
let houseCacheHook = null;
export function onPaletteChange(fn) { houseCacheHook = fn; }
export function paletteName() { return mode; }
export function isColor() { return mode === "color"; }

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(v * (1 + amt))));
  return "rgb(" + f((n >> 16) & 255) + "," + f((n >> 8) & 255) + "," + f(n & 255) + ")";
}

export const canvas = document.getElementById("screen");
export const ctx = canvas.getContext("2d", { alpha: false });
ctx.imageSmoothingEnabled = false;

/* --- 画面の 大きさを ととのえる --------------------------------- */
export function fitScreen() {
  const pad = document.body.classList.contains("touch") ? 0.72 : 0.94;
  const sw = window.innerWidth, sh = window.innerHeight * (document.body.classList.contains("touch") ? 0.62 : 1);
  let s = Math.min(sw / W, (sh / H)) * (document.body.classList.contains("touch") ? 1 : pad);
  s = Math.max(1, Math.floor(s * 2) / 2);          // 0.5きざみ（ドットが ゆがみにくい）
  if (s >= 2) s = Math.floor(s);
  canvas.style.width = (W * s) + "px";
  canvas.style.height = (H * s) + "px";
}

/* --- 四角と 文字 ----------------------------------------------- */
export function clear(c) { ctx.fillStyle = PAL[c == null ? 0 : c]; ctx.fillRect(0, 0, W, H); }
export function rect(x, y, w, h, c) { ctx.fillStyle = PAL[c]; ctx.fillRect(x | 0, y | 0, w | 0, h | 0); }
export function frame(x, y, w, h, c, t) {
  const b = t || 2;
  rect(x, y, w, b, c); rect(x, y + h - b, w, b, c);
  rect(x, y, b, h, c); rect(x + w - b, y, b, h, c);
}

// ゲームボーイ風の 文字わく
export function window9(x, y, w, h) {
  rect(x, y, w, h, 0);
  frame(x, y, w, h, 3, 2);
  frame(x + 3, y + 3, w - 6, h - 6, 3, 1);
}

let fontReady = false;
let fontRev = 0;
export function markFontReady() { fontReady = true; fontRev++; }
export function fontOk() { return fontReady; }
// フォントが よみこまれると 文字の はばが かわるので、
// おりかえしを やりなおす めじるしに つかいます
export function fontRevision() { return fontRev; }

export function setFont(size) {
  ctx.font = (size || 16) + 'px "DotGothic16", "MS Gothic", monospace';
  ctx.textBaseline = "top";
}
export function text(str, x, y, c, size) {
  setFont(size);
  ctx.fillStyle = PAL[c == null ? 3 : c];
  ctx.fillText(str, x | 0, y | 0);
}
export function textW(str, size) { setFont(size); return ctx.measureText(str).width; }
export function textRight(str, x, y, c, size) { text(str, x - textW(str, size), y, c, size); }
export function textCenter(str, cx, y, c, size) { text(str, cx - textW(str, size) / 2, y, c, size); }

/* --- 文字の おりかえし ------------------------------------------
   ・まず「スペース」で 切る（日本語の 分かち書きに あわせる）
   ・1つの かたまりが 長すぎるときだけ 文字で 切る
   ・行あたまに 、。！？ などが こないように する（禁則）
------------------------------------------------------------------ */
const NO_LINE_START = "、。，．！？」』）〕】〉》”’ー…・ゝゞ々ぁぃぅぇぉっゃゅょァィゥェォッャュョ";
const NO_LINE_END = "「『（〔【〈《“‘";

export function wrap(str, maxW, size) {
  const out = [];
  for (const para of String(str == null ? "" : str).split("\n")) {
    let line = "";
    const flush = () => { out.push(line.replace(/\s+$/, "")); line = ""; };

    // スペースを のこしたまま かたまりに 分ける
    const chunks = para.split(/(\s+)/).filter((s) => s !== "");
    for (let chunk of chunks) {
      if (/^\s+$/.test(chunk)) { if (line) line += chunk; continue; }   // 行あたまの スペースは すてる

      if (line && textW(line + chunk, size) > maxW) flush();

      // かたまり だけで はみ出すときは 文字で 分ける
      while (textW(line + chunk, size) > maxW) {
        let i = 1;
        while (i < chunk.length && textW(line + chunk.slice(0, i + 1), size) <= maxW) i++;
        // 禁則：つぎの行の あたまに おけない文字なら 1つ手前で 切る
        if (i < chunk.length && NO_LINE_START.indexOf(chunk[i]) >= 0 && i > 1) i--;
        // 禁則：行おわりに おけない文字なら 1つ手前で 切る
        if (i > 1 && NO_LINE_END.indexOf(chunk[i - 1]) >= 0) i--;
        if (i <= 0) break;
        line += chunk.slice(0, i);
        chunk = chunk.slice(i);
        flush();
        if (!chunk) break;
      }
      line += chunk;
    }
    if (line.replace(/\s+$/, "")) flush();
    else if (!chunks.length) out.push("");     // わざと あけた 1行
  }
  return out.length ? out : [""];
}

// はみ出す文字を「…」で つめる
export function fitText(str, maxW, size) {
  let s = String(str == null ? "" : str);
  if (textW(s, size) <= maxW) return s;
  while (s.length > 1 && textW(s + "…", size) > maxW) s = s.slice(0, -1);
  return s + "…";
}
export function textFit(str, x, y, maxW, c, size) { text(fitText(str, maxW, size), x, y, c, size); }

/* --- ドット絵 --------------------------------------------------
   "0123." の もじれつ から えを つくります（. は とうめい）
------------------------------------------------------------------ */
const tileCache = new Map();
const spriteCache = new Map();

export function makeArt(rows, scale, key, setName) {
  const pal = setName ? resolve(setName) : PAL;
  const k = key ? key + "@" + scale + "@" + mode + "@" + (setName || curSet) : null;
  if (k && spriteCache.has(k)) return spriteCache.get(k);
  const s = scale || 1;
  const h = rows.length, w = rows[0].length;
  const cv = document.createElement("canvas");
  cv.width = w * s; cv.height = h * s;
  const c = cv.getContext("2d");
  c.imageSmoothingEnabled = false;
  for (let y = 0; y < h; y++) {
    const row = rows[y];
    for (let x = 0; x < w; x++) {
      const ch = row[x];
      if (ch === "." || ch === " ") continue;
      c.fillStyle = pal[+ch] || pal[3];
      c.fillRect(x * s, y * s, s, s);
    }
  }
  if (k) spriteCache.set(k, cv);
  return cv;
}

// モンスターの え（白黒モードでは はいけいと まぎれないように こさを ずらす）
const MONO_SHIFT = { "0": "0", "1": "2", "2": "3", "3": "3" };
export function makeMonArt(rows, scale, key, setName) {
  if (mode === "color") return makeArt(rows, scale, key, setName);
  const shifted = rows.map((r) => r.replace(/[0-3]/g, (c) => MONO_SHIFT[c]));
  return makeArt(shifted, scale, (key || "") + "#mono", setName);
}

// もじごとに いろを していして えがく（主人公の ふくの 色がえ用）
export function makeColorArt(rows, scale, key, colors) {
  const sig = Object.keys(colors).sort().map((k) => k + colors[k]).join("");
  const k = key ? key + "@" + scale + "@" + sig : null;
  if (k && spriteCache.has(k)) return spriteCache.get(k);
  const s = scale || 1;
  const h = rows.length, w = rows[0].length;
  const cv = document.createElement("canvas");
  cv.width = w * s; cv.height = h * s;
  const c = cv.getContext("2d");
  c.imageSmoothingEnabled = false;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ch = rows[y][x];
      const col = colors[ch];
      if (!col) continue;
      c.fillStyle = col;
      c.fillRect(x * s, y * s, s, s);
    }
  }
  if (k) spriteCache.set(k, cv);
  return cv;
}

// マスの え（32x32）を いちど つくって おぼえておく
export function tileCanvas(name, painter, setName) {
  const k = name + "@" + mode + "@" + (setName || curSet);
  if (tileCache.has(k)) return tileCache.get(k);
  const cv = document.createElement("canvas");
  cv.width = TILE; cv.height = TILE;
  const c = cv.getContext("2d");
  c.imageSmoothingEnabled = false;
  const prev = setName ? use(setName) : null;
  const px = new Pixel(c);
  px.name = setName || curSet;
  painter(px);
  if (prev) use(prev);
  tileCache.set(k, cv);
  return cv;
}

// 16x16 の ドットで かくための ちいさな どうぐ（じっさいは 2x2 の 四角）
export class Pixel {
  constructor(c) { this.c = c; this.pal = null; }
  // とちゅうで べつの いろセットに きりかえる（き の みきを 茶色に する など）
  set(name) { this.pal = name ? resolve(name) : null; return this; }
  col(i) { return (this.pal || PAL)[i]; }
  fill(i) { this.c.fillStyle = this.col(i); this.c.fillRect(0, 0, TILE, TILE); return this; }
  p(x, y, i) { this.c.fillStyle = this.col(i); this.c.fillRect(x * 2, y * 2, 2, 2); return this; }
  box(x, y, w, h, i) { this.c.fillStyle = this.col(i); this.c.fillRect(x * 2, y * 2, w * 2, h * 2); return this; }
  line(x0, y0, x1, y1, i) {
    if (y0 === y1) return this.box(Math.min(x0, x1), y0, Math.abs(x1 - x0) + 1, 1, i);
    if (x0 === x1) return this.box(x0, Math.min(y0, y1), 1, Math.abs(y1 - y0) + 1, i);
    return this;
  }
  /* --- こまかい えがきかた（32x32 の 1ドットずつ） --- */
  f(x, y, i) { this.c.fillStyle = this.col(i); this.c.fillRect(x, y, 1, 1); return this; }
  fbox(x, y, w, h, i) { this.c.fillStyle = this.col(i); this.c.fillRect(x, y, w, h); return this; }
  ffill(i) { this.c.fillStyle = this.col(i); this.c.fillRect(0, 0, TILE, TILE); return this; }
  fdither(x, y, w, h, i, odd) {
    for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) {
      if (((x + xx) + (y + yy)) % 2 === (odd ? 1 : 0)) this.f(x + xx, y + yy, i);
    }
    return this;
  }
  // すこし ばらついた てん（草・砂の きめ）
  fnoise(seed, n, i, x0, y0, w, h) {
    let s = seed >>> 0;
    for (let k = 0; k < n; k++) {
      s = (s * 1664525 + 1013904223) >>> 0;
      const x = x0 + (s >>> 16) % w;
      s = (s * 1664525 + 1013904223) >>> 0;
      const y = y0 + (s >>> 16) % h;
      this.f(x, y, i);
    }
    return this;
  }
  // まるい ふち（オートタイル用）
  fcorner(cx, cy, r, i) {
    for (let y = 0; y < TILE; y++) for (let x = 0; x < TILE; x++) {
      const dx = x - cx, dy = y - cy;
      if (dx * dx + dy * dy > r * r) continue;
      this.f(x, y, i);
    }
    return this;
  }

  // まだらもよう（ゲームボーイらしい あみかけ）
  dither(x, y, w, h, i, odd) {
    for (let yy = 0; yy < h; yy++) {
      for (let xx = 0; xx < w; xx++) {
        if (((x + xx) + (y + yy)) % 2 === (odd ? 1 : 0)) this.p(x + xx, y + yy, i);
      }
    }
    return this;
  }
  art(rows, ox, oy) {
    for (let y = 0; y < rows.length; y++) {
      for (let x = 0; x < rows[y].length; x++) {
        const ch = rows[y][x];
        if (ch === "." || ch === " ") continue;
        this.p(x + (ox || 0), y + (oy || 0), +ch);
      }
    }
    return this;
  }
}

export function draw(img, x, y) { ctx.drawImage(img, x | 0, y | 0); }
export function drawScaled(img, x, y, w, h) { ctx.drawImage(img, x | 0, y | 0, w | 0, h | 0); }
