// ============================================================
//  マスの え（1マス＝16x16ドットを 2ばいに して 32x32）
//   ゲームボーイカラーと おなじで、マスごとに いろセットを もちます。
//   p.set("wood") のように とちゅうで べつの セットにも できます。
// ============================================================
import { tileCanvas } from "./gfx.js";

// とおれるか / しらべられるか
export const SOLID = new Set(["T", "R", "W", "#", "r", "w", "S", "X", "=", "c", "b", "t", "K", "V", "P", "s"]);
export const ENCOUNTER = new Set(['"', "C"]);

const PAINT = {
  // つち・みち
  ".": (p) => { p.fill(0); p.dither(0, 0, 16, 16, 1, true); },

  // くさ（あるける）
  ",": (p) => {
    p.fill(1);
    p.dither(0, 0, 16, 16, 0, false);
    p.p(3, 4, 2); p.p(4, 5, 2); p.p(11, 9, 2); p.p(12, 10, 2); p.p(7, 12, 2);
  },

  // たかい くさ（モンスターが でる）
  '"': (p) => {
    p.fill(1);
    p.dither(0, 0, 16, 16, 0, true);
    const blade = (x, y) => { p.box(x, y + 2, 1, 4, 2); p.p(x - 1, y + 1, 2); p.p(x + 1, y + 1, 2); p.p(x, y, 3); };
    blade(3, 3); blade(8, 6); blade(12, 2); blade(5, 10); blade(11, 11);
  },

  // はなばたけ
  F: (p) => {
    PAINT[","](p);
    p.set("flower");
    p.p(4, 4, 2); p.p(3, 5, 2); p.p(5, 5, 2); p.p(4, 6, 2); p.p(4, 5, 1);
    p.p(11, 10, 2); p.p(10, 11, 2); p.p(12, 11, 2); p.p(11, 12, 2); p.p(11, 11, 1);
    p.set(null);
  },

  "~": (p) => { p.fill(0); p.p(3, 3, 1); p.p(9, 5, 1); p.p(5, 11, 1); p.p(12, 9, 1); p.p(7, 8, 1); },

  // き（したは くさ・みきは 茶いろ・はっぱは みどり）
  T: (p) => {
    p.set("grass");
    p.fill(1); p.dither(0, 0, 16, 16, 0, false);
    p.set("wood");
    p.box(6, 11, 4, 5, 2); p.box(7, 11, 2, 5, 3);
    p.set("tree");
    p.box(3, 2, 10, 9, 1);
    p.box(4, 1, 8, 11, 1);
    p.box(5, 3, 4, 4, 0);
    p.dither(4, 6, 8, 4, 2, true);
    p.line(3, 1, 12, 1, 3); p.line(3, 11, 12, 11, 3);
    p.line(2, 2, 2, 10, 3); p.line(13, 2, 13, 10, 3);
    p.set(null);
  },

  // いわ
  R: (p) => {
    p.set("path");
    p.fill(0); p.dither(0, 0, 16, 16, 1, true);
    p.set("rock");
    p.box(3, 5, 10, 8, 1); p.box(4, 4, 8, 10, 1); p.box(5, 6, 4, 3, 0);
    p.dither(6, 9, 6, 3, 2, false);
    p.line(3, 4, 12, 4, 3); p.line(3, 13, 12, 13, 3); p.line(2, 5, 2, 12, 3); p.line(13, 5, 13, 12, 3);
    p.set(null);
  },

  // みず（2まいで うごいて みえる）
  W: (p) => {
    p.fill(1);
    p.dither(0, 0, 16, 16, 2, false);
    p.line(2, 4, 6, 4, 0); p.line(9, 8, 13, 8, 0); p.line(4, 12, 8, 12, 0);
  },
  W2: (p) => {
    p.fill(1);
    p.dither(0, 0, 16, 16, 2, true);
    p.line(4, 4, 8, 4, 0); p.line(7, 8, 11, 8, 0); p.line(2, 12, 6, 12, 0);
  },

  // がけ（下に とびおりられる）
  L: (p) => {
    p.set("grass");
    p.fill(1); p.dither(0, 0, 16, 16, 0, false);
    p.set("ledge");
    p.box(0, 9, 16, 6, 1);
    p.line(0, 9, 15, 9, 3); p.line(0, 14, 15, 14, 3);
    for (let x = 1; x < 16; x += 4) p.box(x, 10, 1, 4, 2);
    p.set(null);
  },

  "=": (p) => {
    p.set("grass");
    PAINT[","](p);
    p.set("fence");
    p.box(0, 6, 16, 2, 1); p.box(0, 10, 16, 2, 1);
    p.box(3, 4, 2, 10, 2); p.box(11, 4, 2, 10, 2);
    p.line(3, 4, 4, 4, 3); p.line(11, 4, 12, 4, 3);
    p.set(null);
  },

  // たてものの かべ
  "#": (p) => {
    p.fill(0);
    for (let y = 0; y < 16; y += 4) {
      p.line(0, y, 15, y, 2);
      for (let x = (y % 8 === 0 ? 3 : 7); x < 16; x += 8) p.box(x, y, 1, 4, 1);
    }
  },

  // やね
  r: (p) => {
    p.fill(1);
    for (let y = 1; y < 16; y += 3) p.line(0, y, 15, y, 2);
    for (let y = 0; y < 16; y += 3) {
      for (let x = (y % 6 === 0 ? 2 : 6); x < 16; x += 8) p.box(x, y, 1, 3, 0);
    }
    p.line(0, 15, 15, 15, 3);
  },

  // まど
  w: (p) => {
    PAINT["#"](p);
    p.set("water");
    p.box(3, 4, 10, 8, 3); p.box(4, 5, 8, 6, 1);
    p.box(4, 5, 4, 3, 0);
    p.box(7, 5, 2, 6, 3); p.box(4, 7, 8, 1, 3);
    p.set(null);
  },

  // ドア
  D: (p) => {
    p.set("wall");
    p.fill(0); p.box(0, 0, 16, 2, 2);
    p.set("door");
    p.box(2, 2, 12, 14, 3); p.box(3, 3, 10, 13, 1); p.box(4, 5, 8, 11, 2);
    p.line(4, 5, 11, 5, 3);
    p.set("flower");
    p.box(10, 9, 2, 2, 1);
    p.set(null);
  },

  // かんばん（くさの うえ）
  S: (p) => {
    p.set("grass");
    PAINT[","](p);
    p.set("wood");
    p.box(7, 10, 2, 6, 2);
    p.box(2, 2, 12, 9, 3); p.box(3, 3, 10, 7, 1);
    p.set("sign");
    p.line(4, 5, 11, 5, 3); p.line(4, 7, 9, 7, 3);
    p.set(null);
  },

  // かんばん（まちなか）
  s: (p) => {
    p.set("path");
    PAINT["."](p);
    p.set("wood");
    p.box(6, 9, 4, 7, 2);
    p.set("sign");
    p.box(1, 1, 14, 9, 3); p.box(2, 2, 12, 7, 0);
    p.line(4, 4, 11, 4, 2); p.line(4, 6, 9, 6, 2);
    p.set(null);
  },

  // ほらあな
  C: (p) => { p.fill(1); p.dither(0, 0, 16, 16, 0, false); p.p(4, 6, 2); p.p(11, 12, 2); },
  X: (p) => {
    p.fill(2);
    p.dither(0, 0, 16, 16, 3, true);
    p.box(3, 3, 5, 4, 3); p.box(9, 8, 5, 5, 3); p.box(2, 10, 4, 3, 3);
    p.box(4, 4, 3, 2, 1);
  },

  // かいだん
  u: (p) => {
    p.fill(1);
    for (let i = 0; i < 4; i++) { p.box(2 + i, 3 + i * 3, 12 - i * 2, 3, 2); p.line(2 + i, 3 + i * 3, 13 - i, 3 + i * 3, 3); }
  },

  /* --- おくない ------------------------------------------------ */
  f: (p) => { p.fill(0); p.line(0, 0, 15, 0, 1); p.line(0, 0, 0, 15, 1); },
  g: (p) => { p.fill(1); p.dither(0, 0, 16, 16, 0, true); p.line(0, 0, 15, 0, 2); },
  x: (p) => { p.fill(2); p.box(1, 1, 14, 14, 1); p.box(3, 3, 10, 10, 0); },

  c: (p) => {   // カウンター
    p.fill(1); p.box(0, 0, 16, 3, 0); p.line(0, 3, 15, 3, 3); p.line(0, 15, 15, 15, 3);
    p.dither(0, 5, 16, 9, 2, true);
  },

  b: (p) => {   // ほんだな
    p.fill(2);
    p.set("book");
    for (let y = 1; y < 15; y += 5) {
      for (let x = 1; x < 15; x += 2) p.box(x, y, 1, 4, (x % 4 === 1) ? 1 : 2);
    }
    p.set(null);
    for (let y = 1; y < 15; y += 5) p.line(0, y + 4, 15, y + 4, 3);
  },

  t: (p) => {   // つくえ
    p.fill(0); p.box(1, 2, 14, 11, 1); p.line(1, 2, 14, 2, 3); p.line(1, 12, 14, 12, 3);
    p.box(2, 13, 2, 3, 2); p.box(12, 13, 2, 3, 2);
  },

  B: (p) => {   // ベッド
    p.fill(0);
    p.set("carpet");
    p.box(2, 1, 12, 14, 1); p.line(2, 1, 13, 1, 3); p.line(2, 14, 13, 14, 3);
    p.line(2, 1, 2, 14, 3); p.line(13, 1, 13, 14, 3);
    p.set("floor");
    p.box(4, 2, 8, 4, 0);
    p.set("carpet");
    p.line(3, 7, 12, 7, 2);
    p.set(null);
  },

  K: (p) => {   // かいふくの きかい
    p.fill(1); p.box(1, 1, 14, 13, 2); p.box(3, 3, 10, 6, 0);
    p.set("flower");
    p.box(7, 4, 2, 4, 2); p.box(6, 5, 4, 2, 2);   // あかい 十字
    p.set(null);
    p.box(3, 10, 3, 2, 3); p.box(9, 10, 3, 2, 3);
  },

  P: (p) => {   // パソコン
    p.fill(1); p.box(2, 2, 12, 9, 3);
    p.set("water");
    p.box(3, 3, 10, 7, 1);
    p.line(4, 5, 8, 5, 0); p.line(4, 7, 10, 7, 0);
    p.set(null);
    p.box(5, 12, 6, 3, 2);
  },

  V: (p) => {   // かんようしょくぶつ
    p.set("floor");
    p.fill(0);
    p.set("wood");
    p.box(5, 10, 6, 5, 1); p.line(5, 10, 10, 10, 3);
    p.set("plant");
    p.box(6, 4, 4, 6, 1); p.box(3, 5, 4, 4, 1); p.box(9, 5, 4, 4, 1);
    p.box(6, 4, 2, 2, 0);
    p.line(3, 4, 12, 4, 3);
    p.set(null);
  },
};

/* --- どの いろセットで ぬるか --------------------------------- */
const TILE_SET = {
  ".": "path", ",": "grass", '"': "tallgrass", F: "grass", "~": "sand",
  T: "tree", R: "rock", W: "water", L: "ledge", "=": "fence",
  "#": "wall", r: "roof", w: "wall", D: "door", S: "sign", s: "sign",
  C: "cave", X: "cave", u: "wood",
  f: "floor", g: "carpet", x: "carpet", c: "wood", b: "wood", t: "wood",
  B: "floor", K: "machine", P: "machine", V: "plant",
};

// override は マップごとの いろちがい（やねの 色など）
export function tileFor(ch, frame, override) {
  const set = (override && override[ch]) || TILE_SET[ch] || "path";
  if (ch === "W" && frame) return tileCanvas("W2", PAINT.W2, set);
  const f = PAINT[ch] || PAINT["."];
  return tileCanvas(ch === "W" ? "W" : ch, f, set);
}

export function tileSet(ch) { return TILE_SET[ch] || "path"; }
export function solid(ch) { return SOLID.has(ch); }
