// ============================================================
//  マスの え（1マス＝16x16ドットを 2ばいに して 32x32）
//   ゲームボーイカラーと おなじで、マスごとに いろセットを もちます。
//   p.set("wood") のように とちゅうで べつの セットにも できます。
// ============================================================
import { tileCanvas } from "./gfx.js";

// とおれるか / しらべられるか
export const SOLID = new Set(["T", "R", "W", "#", "r", "w", "S", "X", "=", "c", "b", "t", "K", "V", "P", "s"]);
export const ENCOUNTER = new Set(['"', "C"]);

// mask のビット： 1=上 2=右 4=下 8=左 に「おなじ なかま」が いる
const N = 1, E = 2, S = 4, Wl = 8;

const PAINT = {
  /* ---------------- じめん ---------------- */
  // くさ（ふつう）
  ",": (p) => {
    p.ffill(1);
    p.fnoise(11, 90, 0, 0, 0, 32, 32);
    p.fnoise(23, 40, 2, 0, 0, 32, 32);
    const tuft = (x, y) => { p.fbox(x, y + 1, 1, 2, 2); p.f(x - 1, y + 2, 2); p.f(x + 1, y + 2, 2); p.f(x, y, 2); };
    tuft(6, 7); tuft(19, 4); tuft(25, 18); tuft(11, 23); tuft(28, 27);
  },

  // たかい くさ（ガオンが でる）
  '"': (p) => {
    p.set("grass");
    p.ffill(1);
    p.fnoise(11, 70, 0, 0, 0, 32, 32);
    p.set(null);
    const blade = (x, y, h) => {
      p.fbox(x, y, 2, h, 1);
      p.fbox(x, y, 1, h, 2);
      p.f(x - 1, y + 3, 2); p.f(x + 2, y + 4, 2);
      p.fbox(x, y - 2, 2, 3, 2);
      p.f(x, y - 3, 3);
    };
    blade(4, 10, 14); blade(11, 6, 17); blade(18, 11, 13); blade(25, 7, 16);
    blade(8, 20, 10); blade(21, 21, 9); blade(29, 18, 12); blade(1, 17, 12);
    p.fdither(0, 24, 32, 8, 2, false);
  },

  // つち・みち（まわりが みちで なければ ふちを ぼかす）
  ".": (p, mask) => {
    p.ffill(0);
    p.fnoise(7, 60, 1, 0, 0, 32, 32);
    p.fnoise(31, 18, 2, 0, 0, 32, 32);
    p.set("grass");
    if (!(mask & N)) { p.fbox(0, 0, 32, 2, 1); p.fdither(0, 2, 32, 3, 1, false); }
    if (!(mask & S)) { p.fbox(0, 30, 32, 2, 1); p.fdither(0, 27, 32, 3, 1, true); }
    if (!(mask & Wl)) { p.fbox(0, 0, 2, 32, 1); p.fdither(2, 0, 3, 32, 1, false); }
    if (!(mask & E)) { p.fbox(30, 0, 2, 32, 1); p.fdither(27, 0, 3, 32, 1, true); }
    p.set(null);
  },

  // すな
  "~": (p, mask) => {
    p.ffill(0);
    p.fnoise(5, 70, 1, 0, 0, 32, 32);
    p.fnoise(19, 24, 2, 0, 0, 32, 32);
    p.set("grass");
    if (!(mask & N)) p.fdither(0, 0, 32, 4, 1, false);
    if (!(mask & S)) p.fdither(0, 28, 32, 4, 1, true);
    if (!(mask & Wl)) p.fdither(0, 0, 4, 32, 1, false);
    if (!(mask & E)) p.fdither(28, 0, 4, 32, 1, true);
    p.set(null);
  },

  // はなばたけ
  F: (p, mask) => {
    PAINT[","](p, mask);
    p.set("flower");
    const flower = (x, y, c) => {
      p.f(x, y - 2, c); p.f(x - 2, y, c); p.f(x + 2, y, c); p.f(x, y + 2, c);
      p.f(x - 1, y - 1, c); p.f(x + 1, y - 1, c); p.f(x - 1, y + 1, c); p.f(x + 1, y + 1, c);
      p.f(x, y, 1);
    };
    flower(8, 9, 2); flower(23, 21, 2); flower(17, 6, 3);
    p.set(null);
  },

  /* ---------------- みず ---------------- */
  W: (p, mask) => {
    p.ffill(1);
    p.fdither(0, 0, 32, 32, 2, false);
    p.fbox(4, 7, 9, 1, 0); p.fbox(18, 15, 10, 1, 0); p.fbox(8, 23, 8, 1, 0);
    p.f(14, 8, 0); p.f(28, 16, 0); p.f(17, 24, 0);
    // きしべ（まわりが みずで ないところ）
    if (!(mask & N)) { p.fbox(0, 0, 32, 2, 0); p.fdither(0, 2, 32, 2, 0, false); }
    if (!(mask & S)) { p.fbox(0, 30, 32, 2, 0); p.fdither(0, 28, 32, 2, 0, true); }
    if (!(mask & Wl)) { p.fbox(0, 0, 2, 32, 0); p.fdither(2, 0, 2, 32, 0, false); }
    if (!(mask & E)) { p.fbox(30, 0, 2, 32, 0); p.fdither(28, 0, 2, 32, 0, true); }
  },
  W2: (p, mask) => {
    p.ffill(1);
    p.fdither(0, 0, 32, 32, 2, true);
    p.fbox(8, 6, 9, 1, 0); p.fbox(14, 16, 10, 1, 0); p.fbox(4, 24, 8, 1, 0);
    if (!(mask & N)) { p.fbox(0, 0, 32, 2, 0); p.fdither(0, 2, 32, 2, 0, true); }
    if (!(mask & S)) { p.fbox(0, 30, 32, 2, 0); p.fdither(0, 28, 32, 2, 0, false); }
    if (!(mask & Wl)) { p.fbox(0, 0, 2, 32, 0); p.fdither(2, 0, 2, 32, 0, true); }
    if (!(mask & E)) { p.fbox(30, 0, 2, 32, 0); p.fdither(28, 0, 2, 32, 0, false); }
  },

  /* ---------------- き と いわ ---------------- */
  // となりの きと つながって もりに 見える
  T: (p, mask) => {
    p.set("grass");
    p.ffill(1); p.fnoise(3, 60, 0, 0, 0, 32, 32);
    p.set("tree");
    p.fdither(5, 27, 22, 4, 3, false);              // かげ
    p.set("wood");
    p.fbox(13, 21, 6, 9, 2); p.fbox(15, 21, 2, 9, 3);
    p.set("tree");
    const t = (mask & 1) ? 0 : 2;
    const b = (mask & 4) ? 32 : 25;
    const l = (mask & 8) ? 0 : 2;
    const r = (mask & 2) ? 32 : 30;
    // はっぱの かたまり
    p.fbox(l, t, r - l, b - t, 1);
    p.fcorner(10, t + 8, 7, 0);
    p.fcorner(21, t + 13, 6, 0);
    p.fdither(l + 1, t + 10, r - l - 2, 10, 2, true);
    p.fdither(l + 1, b - 6, r - l - 2, 6, 2, false);
    // ふち（となりに きが ないところ だけ）
    if (!(mask & 1)) { p.fbox(l, t, r - l, 1, 3); p.f(l, t + 1, 3); p.f(r - 1, t + 1, 3); }
    if (!(mask & 4)) { p.fbox(l, b - 1, r - l, 1, 3); }
    if (!(mask & 8)) { p.fbox(l, t, 1, b - t, 3); }
    if (!(mask & 2)) { p.fbox(r - 1, t, 1, b - t, 3); }
    p.set(null);
  },

  R: (p, mask) => {
    p.set("grass");
    p.ffill(1); p.fnoise(9, 50, 0, 0, 0, 32, 32);
    p.set("rock");
    p.fdither(6, 25, 22, 4, 3, false);           // かげ
    p.fcorner(16, 16, 13, 1);
    p.fcorner(11, 11, 7, 0);
    p.fdither(6, 18, 21, 10, 2, true);
    p.fbox(9, 21, 5, 1, 2); p.fbox(18, 14, 6, 1, 2);
    // ふちを かこむ
    for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) {
      const dx = x - 16, dy = y - 17, d = dx * dx + dy * dy;
      if (d <= 144 && d > 121) p.f(x, y, 3);
    }
    p.set(null);
  },

  // がけ（下に とびおりられる）
  L: (p) => {
    p.set("grass");
    p.ffill(1); p.fnoise(13, 50, 0, 0, 0, 32, 32);
    p.set("ledge");
    p.fbox(0, 16, 32, 14, 1);
    p.fbox(0, 16, 32, 2, 0);
    p.fdither(0, 18, 32, 4, 2, false);
    p.fbox(0, 28, 32, 4, 3);
    for (let x = 2; x < 32; x += 6) p.fbox(x, 20, 2, 8, 2);
    p.set(null);
  },

  "=": (p) => {
    p.set("grass");
    PAINT[","](p, 15);
    p.set("fence");
    p.fbox(0, 12, 32, 3, 1); p.fbox(0, 20, 32, 3, 1);
    p.fbox(6, 8, 4, 20, 2); p.fbox(22, 8, 4, 20, 2);
    p.fbox(6, 8, 4, 2, 3); p.fbox(22, 8, 4, 2, 3);
    p.set(null);
  },

  /* ---------------- たてもの ---------------- */
  "#": (p) => {
    p.ffill(0);
    for (let y = 0; y < 32; y += 8) {
      p.fbox(0, y, 32, 1, 2);
      for (let x = (y % 16 === 0 ? 6 : 14); x < 32; x += 16) p.fbox(x, y, 1, 8, 1);
    }
    p.fnoise(17, 30, 1, 0, 0, 32, 32);
  },

  r: (p, mask) => {
    p.ffill(1);
    for (let y = 2; y < 32; y += 6) {
      p.fbox(0, y, 32, 1, 2);
      p.fdither(0, y + 1, 32, 2, 0, false);
    }
    for (let y = 0; y < 32; y += 6) {
      for (let x = (y % 12 === 0 ? 5 : 13); x < 32; x += 16) p.fbox(x, y, 1, 6, 2);
    }
    if (!(mask & N)) p.fbox(0, 0, 32, 3, 0);
    if (!(mask & S)) p.fbox(0, 29, 32, 3, 3);
  },

  w: (p) => {
    PAINT["#"](p, 15);
    p.set("water");
    p.fbox(6, 8, 20, 16, 3);
    p.fbox(8, 10, 16, 12, 1);
    p.fbox(8, 10, 7, 5, 0);
    p.fbox(15, 10, 2, 12, 3); p.fbox(8, 15, 16, 2, 3);
    p.set(null);
  },

  D: (p) => {
    p.set("wall");
    p.ffill(0); p.fbox(0, 0, 32, 4, 2);
    p.set("door");
    p.fbox(5, 4, 22, 28, 3);
    p.fbox(7, 6, 18, 26, 1);
    p.fbox(9, 9, 14, 21, 2);
    p.fbox(9, 9, 14, 1, 3); p.fbox(9, 19, 14, 1, 3);
    p.set("flower");
    p.fbox(20, 18, 3, 3, 1);
    p.set(null);
  },

  S: (p) => {
    p.set("grass");
    PAINT[","](p, 15);
    p.set("wood");
    p.fbox(14, 20, 4, 12, 2); p.fbox(15, 20, 1, 12, 3);
    p.fbox(3, 4, 26, 18, 3);
    p.set("sign");
    p.fbox(5, 6, 22, 14, 0);
    p.fbox(8, 10, 16, 1, 2); p.fbox(8, 14, 11, 1, 2);
    p.set(null);
  },

  s: (p) => {
    p.set("path");
    PAINT["."](p, 15);
    p.set("wood");
    p.fbox(13, 18, 6, 14, 2);
    p.set("sign");
    p.fbox(2, 2, 28, 18, 3);
    p.fbox(4, 4, 24, 14, 0);
    p.fbox(7, 8, 18, 1, 2); p.fbox(7, 12, 12, 1, 2);
    p.set(null);
  },

  /* ---------------- ほらあな ---------------- */
  C: (p) => {
    p.ffill(1);
    p.fdither(0, 0, 32, 32, 0, false);
    p.fnoise(21, 40, 2, 0, 0, 32, 32);
    p.f(9, 12, 3); p.f(23, 25, 3); p.f(16, 7, 3);
  },
  X: (p, mask) => {
    p.ffill(2);
    p.fdither(0, 0, 32, 32, 3, true);
    p.fcorner(8, 9, 6, 3); p.fcorner(22, 20, 7, 3); p.fcorner(6, 25, 5, 3);
    p.fcorner(8, 9, 3, 1);
    if (!(mask & N)) p.fbox(0, 0, 32, 3, 1);
    if (!(mask & S)) p.fbox(0, 29, 32, 3, 3);
  },

  u: (p) => {
    p.ffill(1);
    for (let i = 0; i < 4; i++) {
      p.fbox(4 + i * 2, 6 + i * 6, 24 - i * 4, 6, 2);
      p.fbox(4 + i * 2, 6 + i * 6, 24 - i * 4, 1, 3);
    }
  },

  // さんばし
  d: (p, mask) => {
    p.ffill(1);
    for (let y = 0; y < 32; y += 8) {
      p.fbox(0, y, 32, 1, 3);
      p.fbox(0, y + 1, 32, 2, 0);
      p.fdither(0, y + 3, 32, 2, 2, false);
    }
    p.f(5, 4, 3); p.f(26, 12, 3); p.f(11, 21, 3); p.f(20, 29, 3);
    if (!(mask & Wl)) p.fbox(0, 0, 1, 32, 3);
    if (!(mask & E)) p.fbox(31, 0, 1, 32, 3);
  },

  // 石だたみ
  m: (p) => {
    p.ffill(1);
    for (let y = 0; y < 32; y += 10) {
      p.fbox(0, y, 32, 1, 2);
      for (let x = (y % 20 === 0 ? 8 : 18); x < 32; x += 20) p.fbox(x, y, 1, 10, 2);
    }
    p.fnoise(29, 24, 0, 0, 0, 32, 32);
  },

  /* ---------------- おくない ---------------- */
  f: (p) => {
    p.ffill(0);
    p.fbox(0, 0, 32, 1, 1); p.fbox(0, 0, 1, 32, 1);
    p.fnoise(37, 16, 1, 2, 2, 28, 28);
  },
  g: (p) => {
    p.ffill(1);
    p.fdither(0, 0, 32, 32, 0, true);
    p.fbox(0, 0, 32, 2, 2); p.fbox(0, 0, 2, 32, 2);
  },
  x: (p) => {
    p.ffill(2);
    p.fbox(2, 2, 28, 28, 1);
    p.fbox(6, 6, 20, 20, 0);
  },
  c: (p) => {
    p.ffill(1);
    p.fbox(0, 0, 32, 7, 0);
    p.fbox(0, 7, 32, 2, 3);
    p.fdither(0, 10, 32, 20, 2, true);
    p.fbox(0, 30, 32, 2, 3);
  },
  b: (p) => {
    p.ffill(2);
    p.set("book");
    for (let y = 2; y < 30; y += 10) {
      for (let x = 2; x < 30; x += 4) p.fbox(x, y, 3, 8, (x % 8 === 2) ? 1 : 2);
    }
    p.set(null);
    for (let y = 2; y < 32; y += 10) p.fbox(0, y + 8, 32, 2, 3);
  },
  t: (p) => {
    p.ffill(0);
    p.fbox(2, 4, 28, 22, 1);
    p.fbox(2, 4, 28, 2, 3); p.fbox(2, 24, 28, 2, 3);
    p.fbox(4, 26, 4, 6, 2); p.fbox(24, 26, 4, 6, 2);
    p.fnoise(41, 20, 0, 4, 8, 24, 14);
  },
  B: (p) => {
    p.ffill(0);
    p.set("carpet");
    p.fbox(4, 2, 24, 28, 1);
    p.fbox(4, 2, 24, 2, 3); p.fbox(4, 28, 24, 2, 3);
    p.fbox(4, 2, 2, 28, 3); p.fbox(26, 2, 2, 28, 3);
    p.set("floor");
    p.fbox(8, 4, 16, 8, 0);
    p.set("carpet");
    p.fbox(6, 14, 20, 2, 2);
    p.set(null);
  },
  K: (p) => {
    p.ffill(1);
    p.fbox(2, 2, 28, 26, 2);
    p.fbox(6, 6, 20, 12, 0);
    p.set("flower");
    p.fbox(14, 8, 4, 8, 2); p.fbox(12, 10, 8, 4, 2);
    p.set(null);
    p.fbox(6, 20, 6, 4, 3); p.fbox(18, 20, 6, 4, 3);
  },
  P: (p) => {
    p.ffill(1);
    p.fbox(4, 4, 24, 18, 3);
    p.set("water");
    p.fbox(6, 6, 20, 14, 1);
    p.fbox(8, 10, 10, 1, 0); p.fbox(8, 14, 14, 1, 0);
    p.set(null);
    p.fbox(10, 24, 12, 6, 2);
  },
  V: (p) => {
    p.set("floor");
    p.ffill(0);
    p.set("wood");
    p.fbox(10, 20, 12, 10, 1);
    p.fbox(10, 20, 12, 2, 3);
    p.set("plant");
    p.fcorner(16, 12, 9, 1);
    p.fcorner(12, 9, 5, 0);
    p.fdither(8, 14, 16, 6, 2, true);
    p.set(null);
  },
};

/* --- どの いろセットで ぬるか --------------------------------- */
const TILE_SET = {
  ".": "path", ",": "grass", '"': "tallgrass", F: "grass", "~": "sand",
  T: "tree", R: "rock", W: "water", L: "ledge", "=": "fence",
  "#": "wall", r: "roof", w: "wall", D: "door", S: "sign", s: "sign",
  C: "cave", X: "cave", u: "wood", d: "wood", m: "rock",
  f: "floor", g: "carpet", x: "carpet", c: "wood", b: "wood", t: "wood",
  B: "floor", K: "machine", P: "machine", V: "plant",
};

// override は マップごとの いろちがい（やねの 色など）
export function tileFor(ch, frame, override, mask) {
  const set = (override && override[ch]) || TILE_SET[ch] || "path";
  const m = mask == null ? 15 : mask;
  const name = (ch === "W" && frame) ? "W2" : ch;
  const f = (ch === "W" && frame) ? PAINT.W2 : (PAINT[ch] || PAINT["."]);
  return tileCanvas(name + "#" + m, (p) => f(p, m), set);
}

export function tileSet(ch) { return TILE_SET[ch] || "path"; }
export function solid(ch) { return SOLID.has(ch); }
