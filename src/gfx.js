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
