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
  cv.width = TREE_W * G.AS; cv.height = TREE_H * G.AS;
  const c = cv.getContext("2d");
  c.imageSmoothingEnabled = false;
  const K = G.AS;                            // ほんとうの ドットで えがく

  const leaf = G.resolve("tree");
  const wood = G.resolve("wood");
  const grass = G.resolve("grass");

  const px = (x, y, col) => { c.fillStyle = col; c.fillRect(Math.round(x * K), Math.round(y * K), 1, 1); };
  const box = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(Math.round(x * K), Math.round(y * K), Math.round(w * K), Math.round(h * K)); };
  const disc = (cx, cy, rx, ry, col) => {
    c.fillStyle = col;
    const CY = cy * K, RY = ry * K, RX = rx * K, CX2 = cx * K;
    for (let y = Math.floor(CY - RY); y <= Math.ceil(CY + RY); y++) {
      const t = (y - CY) / RY;
      if (Math.abs(t) > 1) continue;
      const w = Math.round(RX * Math.sqrt(1 - t * t));
      c.fillRect(Math.round(CX2 - w), y, w * 2, 1);
    }
  };
  const dither = (x, y, w, h, col, odd) => {
    c.fillStyle = col;
    const X = Math.round(x * K), Y = Math.round(y * K), Wd = Math.round(w * K), Hd = Math.round(h * K);
    for (let j = 0; j < Hd; j++) for (let i = 0; i < Wd; i++) {
      if (((X + i) + (Y + j)) % 2 === (odd ? 1 : 0)) c.fillRect(X + i, Y + j, 1, 1);
    }
  };
  // はっぱの こまかい つぶ（ほんとうの 1ドット）
  const speck = (cx, cy, rx, ry, col, seed, n) => {
    c.fillStyle = col;
    let sd = seed >>> 0;
    for (let i = 0; i < n; i++) {
      sd = (sd * 1664525 + 1013904223) >>> 0;
      const a = (sd >>> 8) / 16777215 * Math.PI * 2;
      sd = (sd * 1664525 + 1013904223) >>> 0;
      const r = Math.sqrt((sd >>> 8) / 16777215);
      c.fillRect(Math.round((cx + Math.cos(a) * rx * r) * K), Math.round((cy + Math.sin(a) * ry * r) * K), 1, 1);
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
    box(CX - 1, baseY - 11, 1, 8, wood[0]);
    box(CX + 1, baseY - 8, 1, 2, wood[3]);
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
  // 下がわの かげ。かたまりごとに段差をつけ、葉の層を読めるようにする。
  for (const [dx, dy, rx, ry] of sh) {
    disc(CX + dx, top + dy + Math.round(ry * 0.45), rx - 1, Math.max(1, Math.round(ry * 0.5)), leaf[2]);
    box(CX + dx - Math.round(rx * 0.65), top + dy + Math.round(ry * 0.58), Math.round(rx * 1.3), 1, leaf[3]);
  }
  // 上がわの 日なた
  const [mx, my, mrx, mry] = sh[0];
  disc(CX + mx - Math.round(mrx * 0.3), top + my - Math.round(mry * 0.32), Math.round(mrx * 0.55), Math.round(mry * 0.5), leaf[0]);
  dither(CX + mx - mrx, top + my - mry, Math.round(mrx * 0.75), Math.round(mry * 0.55), leaf[0], false);

  // はっぱの こまかい きめ（1ドットの つぶ）
  let sd = 7 + kind * 13;
  for (const [dx, dy, rx, ry] of sh) {
    speck(CX + dx, top + dy - ry * 0.25, rx * 0.8, ry * 0.6, leaf[0], sd += 97, Math.round(rx * ry * 0.18));
    speck(CX + dx, top + dy + ry * 0.35, rx * 0.8, ry * 0.5, leaf[2], sd += 131, Math.round(rx * ry * 0.16));
    speck(CX + dx, top + dy + ry * 0.58, rx * 0.65, ry * 0.32, leaf[3], sd += 71, Math.round(rx * ry * 0.08));
  }

  // はっぱの もよう（ぎざぎざの すじ）
  c.fillStyle = leaf[3];
  for (const [dx, dy, rx, ry] of sh) {
    for (let i = -2; i <= 2; i++) {
      const x = CX + dx + i * Math.round(rx / 2.5);
      const y = top + dy + Math.round(ry * 0.1);
      if (i % 2) {
        px(x, y, leaf[3]); px(x + 1, y + 1, leaf[3]); px(x - 1, y + 1, leaf[3]);
        px(x, y - 2, leaf[0]); px(x + (i < 0 ? -1 : 1), y - 3, leaf[0]);
      }
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
