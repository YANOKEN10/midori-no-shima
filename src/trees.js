// ============================================================
//  き を「1本ずつの まるい 木」として えがく
//   ・マスの え では なく、マスより 少し 大きい 木の えを
//     マスの 上に かさねて えがきます（下から 上に かさなる）
//   ・となりあう 木は かさなって「もり」に 見えます
//   ・あたりはんていは これまでどおり タイル（T）の ままです
// ============================================================
import * as G from "./gfx.js";

const T = G.TILE;          // 32
export const TREE_W = 40;  // 木の えの よこはば
export const TREE_H = 52;  // 木の えの たかさ（マスより 上に はみ出す）
export const TREE_UP = 18; // 上に はみ出す ぶん

const cache = new Map();

/* --- 木 1本の え --- */
export function treeImage(kind, foot) {
  const key = kind + (foot ? "f" : "") + "@" + G.paletteName();
  if (cache.has(key)) return cache.get(key);

  const cv = document.createElement("canvas");
  cv.width = TREE_W; cv.height = TREE_H;
  const c = cv.getContext("2d");
  c.imageSmoothingEnabled = false;

  const leaf = G.resolve("tree");
  const wood = G.resolve("wood");
  const grass = G.resolve("grass");

  const px = (x, y, col) => { c.fillStyle = col; c.fillRect(x, y, 1, 1); };
  const box = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
  const disc = (cx, cy, rx, ry, col) => {
    c.fillStyle = col;
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      const t = (y - cy) / ry;
      if (Math.abs(t) > 1) continue;
      const w = Math.round(rx * Math.sqrt(1 - t * t));
      c.fillRect(Math.round(cx - w), y, w * 2, 1);
    }
  };
  const dither = (x, y, w, h, col, odd) => {
    c.fillStyle = col;
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      if (((x + i) + (y + j)) % 2 === (odd ? 1 : 0)) c.fillRect(x + i, y + j, 1, 1);
    }
  };

  const CX = TREE_W / 2;
  const baseY = TREE_H - 6;              // ねもとの たかさ

  /* --- かげ（じめんに おちる） --- */
  disc(CX, baseY + 1, 13, 4, grass[2]);
  dither(CX - 15, baseY - 2, 30, 7, grass[2], true);

  /* --- みき --- */
  if (foot) {
    box(CX - 4, baseY - 12, 8, 12, wood[2]);
    box(CX - 4, baseY - 12, 3, 12, wood[1]);
    box(CX + 2, baseY - 12, 2, 12, wood[3]);
    box(CX - 5, baseY - 2, 10, 2, wood[3]);
  }

  /* --- はっぱの かたまり（いくつかの まるを かさねる） --- */
  // kind ごとに ふくらみの ばしょを かえて、木ごとに かたちを ちがえる
  const shapes = [
    [[0, -30, 15, 13], [-10, -22, 10, 9], [10, -22, 10, 9], [0, -16, 14, 9]],
    [[0, -31, 13, 14], [-11, -24, 9, 9], [11, -25, 8, 8], [0, -17, 15, 8]],
    [[-2, -29, 14, 12], [9, -27, 10, 10], [-11, -21, 9, 8], [2, -16, 14, 9]],
    [[0, -33, 12, 12], [-9, -25, 11, 10], [9, -24, 10, 9], [0, -17, 14, 9]],
  ];
  const sh = shapes[kind % shapes.length];
  const top = baseY;

  // ふち（そとがわを ひとまわり 大きく くらい 色で）
  for (const [dx, dy, rx, ry] of sh) disc(CX + dx, top + dy, rx + 1, ry + 1, leaf[3]);
  // はっぱ 本体
  for (const [dx, dy, rx, ry] of sh) disc(CX + dx, top + dy, rx, ry, leaf[1]);
  // 下がわの かげ
  for (const [dx, dy, rx, ry] of sh) {
    disc(CX + dx, top + dy + Math.round(ry * 0.45), rx - 1, Math.max(1, Math.round(ry * 0.5)), leaf[2]);
  }
  // 上がわの 日なた
  const [mx, my, mrx, mry] = sh[0];
  disc(CX + mx - Math.round(mrx * 0.3), top + my - Math.round(mry * 0.32), Math.round(mrx * 0.55), Math.round(mry * 0.5), leaf[0]);
  dither(CX + mx - mrx, top + my - mry, mrx, mry, leaf[0], false);

  // はっぱの もよう（ぎざぎざの すじ）
  c.fillStyle = leaf[3];
  for (const [dx, dy, rx, ry] of sh) {
    for (let i = -2; i <= 2; i++) {
      const x = CX + dx + i * Math.round(rx / 2.5);
      const y = top + dy + Math.round(ry * 0.1);
      if (i % 2) { px(x, y, leaf[3]); px(x + 1, y + 1, leaf[3]); px(x - 1, y + 1, leaf[3]); }
    }
  }

  cache.set(key, cv);
  return cv;
}

/* --- 地図の 木を あつめる（下の れつから 上に かさねる ため 行じゅん） --- */
export function treeAt(map, x, y) {
  const row = map.rows[y];
  return row && row[x] === "T";
}

export function clearTreeCache() { cache.clear(); }
G.onPaletteChange(() => cache.clear());
