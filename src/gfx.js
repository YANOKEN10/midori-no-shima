// ============================================================
//  えがく どうぐ
//   ・画面は 320x288（ゲームボーイの ちょうど2ばい）
//   ・いろは 4しょく だけ。0=いちばん あかるい … 3=いちばん くらい
// ============================================================
export const W = 320, H = 288;
export const TILE = 32;          // マス1つの 大きさ（画面のドット）
export const ART = 16;           // え1マスの ドット数（2ばいに ひきのばす）

export const PALETTES = {
  green: ["#9bbc0f", "#8bac0f", "#306230", "#0f380f"],
  gray:  ["#e8e8d8", "#a8a898", "#585848", "#181810"],
  blue:  ["#dfeff7", "#88b0c8", "#3a6a88", "#101c28"],
};
let palName = "green";
export let PAL = PALETTES.green;

export function setPalette(name) {
  if (!PALETTES[name]) return;
  palName = name;
  PAL = PALETTES[name];
  tileCache.clear();
  spriteCache.clear();
  document.body.style.background = shade(PAL[3], -0.35);
}
export function paletteName() { return palName; }

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
export function markFontReady() { fontReady = true; }
export function fontOk() { return fontReady; }

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

// 文字を おりかえす
export function wrap(str, maxW, size) {
  const out = [];
  let line = "";
  for (const ch of String(str)) {
    if (ch === "\n") { out.push(line); line = ""; continue; }
    const t = line + ch;
    if (textW(t, size) > maxW && line) { out.push(line); line = ch; }
    else line = t;
  }
  out.push(line);
  return out;
}

/* --- ドット絵 --------------------------------------------------
   "0123." の もじれつ から えを つくります（. は とうめい）
------------------------------------------------------------------ */
const tileCache = new Map();
const spriteCache = new Map();

export function makeArt(rows, scale, key) {
  const k = key ? key + "@" + scale + palName : null;
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
      c.fillStyle = PAL[+ch] || PAL[3];
      c.fillRect(x * s, y * s, s, s);
    }
  }
  if (k) spriteCache.set(k, cv);
  return cv;
}

// マスの え（32x32）を いちど つくって おぼえておく
export function tileCanvas(name, painter) {
  const k = name + palName;
  if (tileCache.has(k)) return tileCache.get(k);
  const cv = document.createElement("canvas");
  cv.width = TILE; cv.height = TILE;
  const c = cv.getContext("2d");
  c.imageSmoothingEnabled = false;
  painter(new Pixel(c));
  tileCache.set(k, cv);
  return cv;
}

// 16x16 の ドットで かくための ちいさな どうぐ（じっさいは 2x2 の 四角）
export class Pixel {
  constructor(c) { this.c = c; }
  fill(i) { this.c.fillStyle = PAL[i]; this.c.fillRect(0, 0, TILE, TILE); return this; }
  p(x, y, i) { this.c.fillStyle = PAL[i]; this.c.fillRect(x * 2, y * 2, 2, 2); return this; }
  box(x, y, w, h, i) { this.c.fillStyle = PAL[i]; this.c.fillRect(x * 2, y * 2, w * 2, h * 2); return this; }
  line(x0, y0, x1, y1, i) {
    if (y0 === y1) return this.box(Math.min(x0, x1), y0, Math.abs(x1 - x0) + 1, 1, i);
    if (x0 === x1) return this.box(x0, Math.min(y0, y1), 1, Math.abs(y1 - y0) + 1, i);
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
