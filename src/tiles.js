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
const N1 = 1, E1 = 2, S1 = 4, W1 = 8;

/* --- ひろい 色むら（マスを またいで つながる やわらかい ノイズ） ---
   マスの ばしょ（p.tx,p.ty）から せかい ぜんたいの ざひょうを 作って
   ノイズを 見るので、となりの マスと つながって 見えます。 */
function hash2(x, y, seed) {
  let h = (x * 374761393 + y * 668265263 + seed * 1442695040) | 0;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) >>> 0) / 4294967295;
}
function vnoise(x, y, seed) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const fx = x - xi, fy = y - yi;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const a = hash2(xi, yi, seed), b = hash2(xi + 1, yi, seed);
  const c = hash2(xi, yi + 1, seed), d = hash2(xi + 1, yi + 1, seed);
  return (a + (b - a) * sx) + ((c + (d - c) * sx) - (a + (b - a) * sx)) * sy;
}
// しきい値より こい ところを いろ 2 で ぬる（さかいめは あみかけ）
function patch(p, seed, size, thresh) {
  const N = p.N, ox = (p.tx || 0) * N, oy = (p.ty || 0) * N;
  for (let y = 0; y < N; y += 2) {
    for (let x = 0; x < N; x += 2) {
      const n = vnoise((ox + x) / (size * 2), (oy + y) / (size * 2), seed);
      if (n > thresh + 0.05) p.dbox(x, y, 2, 2, 2);
      else if (n > thresh && ((x + y) % 4 === 0)) p.dbox(x, y, 2, 2, 2);
    }
  }
}

/* --- じめんの きわを まるくする ---
   まわり 8マスを 見て、
     ・となりが 2つとも ちがう → そとがわの かど（まるく けずる）
     ・となりが 2つとも おなじで ななめだけ ちがう → 内がわの かど（すみを うめる）
   けずる ところは まわりの じめんの 色（いま えらんでいる セット）で ぬります。 */
function roundEdges(p, mask, r) {
  const N = 1, E = 2, S = 4, Wl = 8, NE = 16, SE = 32, SW = 64, NW = 128;
  const R = (r || 9) * 2;
  const M = p.N - 1;
  const cut = (cx, cy, sx, sy) => {              // そとがわの かど
    for (let j = 0; j < R; j++) {
      for (let i = 0; i < R; i++) {
        const dx = i + 0.5, dy = j + 0.5;
        const d = Math.sqrt((R - dx) * (R - dx) + (R - dy) * (R - dy));
        const x = cx + sx * i, y = cy + sy * j;
        if (d > R) p.d(x, y, 1);
        else if (d > R - 2.6 && ((x + y) % 2 === 0)) p.d(x, y, 1);
      }
    }
  };
  const fill = (cx, cy, sx, sy) => {             // 内がわの かど
    for (let j = 0; j < 8; j++) for (let i = 0; i < 8 - j; i++) {
      const x = cx + sx * i, y = cy + sy * j;
      if (i + j < 6) p.d(x, y, 1);
      else if ((x + y) % 2 === 0) p.d(x, y, 1);
    }
  };
  if (!(mask & N) && !(mask & Wl)) cut(0, 0, 1, 1);
  else if ((mask & N) && (mask & Wl) && !(mask & NW)) fill(0, 0, 1, 1);
  if (!(mask & N) && !(mask & E)) cut(M, 0, -1, 1);
  else if ((mask & N) && (mask & E) && !(mask & NE)) fill(M, 0, -1, 1);
  if (!(mask & S) && !(mask & Wl)) cut(0, M, 1, -1);
  else if ((mask & S) && (mask & Wl) && !(mask & SW)) fill(0, M, 1, -1);
  if (!(mask & S) && !(mask & E)) cut(M, M, -1, -1);
  else if ((mask & S) && (mask & E) && !(mask & SE)) fill(M, M, -1, -1);
}

const PAINT = {
  /* ---------------- じめん ---------------- */
  // くさ（ふつう）
  ",": (p, mask, v0) => {
    const v = v0 | 0, N = p.N;
    p.ffill(1);
    p.dnoise(11 + v * 37, 320, 0, 0, 0, N, N);     // こまかい くさの きらめき
    p.dnoise(23 + v * 91, 150, 2, 0, 0, N, N);
    // 小さな くさの ふさ（3まいば）
    const tuft = (x, y) => {
      p.dbox(x, y + 1, 1, 4, 2); p.d(x, y, 2);
      p.dbox(x - 2, y + 3, 1, 3, 2); p.dbox(x + 2, y + 3, 1, 3, 2);
      p.d(x - 3, y + 4, 2); p.d(x + 3, y + 4, 2);
    };
    const sets = [[[12, 14], [38, 8], [50, 36], [22, 46]],
                  [[6, 28], [34, 18], [56, 44], [18, 54]],
                  [[24, 10], [48, 24], [10, 42], [40, 52]],
                  [[16, 6], [44, 34], [28, 56], [58, 16]]];
    for (const [x, y] of sets[v % 4]) tuft(x, y);
    if ((v === 5 || v === 12) && p.name === "grass") {
      p.set("flower");
      for (const [fx, fy] of [[52, 12], [46, 18]]) {
        p.d(fx, fy - 2, 2); p.d(fx - 2, fy, 2); p.d(fx + 2, fy, 2); p.d(fx, fy + 2, 2);
        p.d(fx - 1, fy - 1, 2); p.d(fx + 1, fy - 1, 2); p.d(fx - 1, fy + 1, 2); p.d(fx + 1, fy + 1, 2);
        p.d(fx, fy, 1);
      }
      p.set(null);
    }
    if (v === 9) { p.dbox(8, 36, 6, 4, 2); p.dbox(10, 34, 2, 2, 2); }
    if (v === 2 && p.name === "grass") { p.set("tree"); p.dbox(40, 40, 4, 6, 2); p.dbox(38, 38, 8, 4, 1); p.set(null); }
    // ひろい 色むら（マスを またいで つながる）
    patch(p, 0, 46, 0.60);
    patch(p, 97, 27, 0.68);
  },

  // たかい くさ（ガオンが でる）：こい くさむらに ふさが たくさん
  '"': (p, mask, v0) => {
    const v = v0 | 0, N = p.N;
    p.set("tallgrass");
    p.ffill(1);
    p.dnoise(11 + v * 29, 240, 2, 0, 0, N, N);
    p.ddither(0, 44, N, 20, 2, false);
    const tuft = (x, y) => {
      p.dbox(x - 4, y + 6, 2, 8, 3); p.dbox(x + 4, y + 6, 2, 8, 3);
      p.dbox(x, y, 3, 16, 0);
      p.dbox(x - 6, y + 4, 3, 12, 0);
      p.dbox(x + 6, y + 4, 3, 12, 0);
      p.d(x + 1, y - 2, 0); p.d(x - 5, y + 2, 0); p.d(x + 7, y + 2, 0);
      p.dbox(x - 6, y + 16, 15, 2, 3);
    };
    const sets = [[[12, 10], [40, 16], [24, 36], [52, 40]],
                  [[18, 14], [46, 8], [10, 38], [36, 42]],
                  [[30, 6], [54, 22], [14, 32], [42, 46]],
                  [[8, 18], [34, 12], [56, 34], [20, 44]]];
    for (const [x, y] of sets[v % 4]) tuft(x, y);
    p.set(null);
  },

  // つち・みち（まわりが みちで なければ ふちを ぼかす）
  ".": (p, mask, v0) => {
    const v = v0 | 0, N = p.N;
    p.ffill(0);
    p.dnoise(7 + v * 53, 240, 1, 0, 0, N, N);
    p.dnoise(31 + v * 17, 80, 2, 0, 0, N, N);
    if (v % 8 === 3) { p.dbox(40, 24, 6, 4, 2); p.dbox(42, 22, 2, 2, 2); }
    if (v % 8 === 6) { p.dbox(14, 44, 4, 4, 2); }
    p.set(p.ground || "grass");
    if (!(mask & N1)) { p.dbox(0, 0, N, 3, 1); p.ddither(0, 3, N, 6, 1, false); }
    if (!(mask & S1)) { p.dbox(0, N - 3, N, 3, 1); p.ddither(0, N - 9, N, 6, 1, true); }
    if (!(mask & W1)) { p.dbox(0, 0, 3, N, 1); p.ddither(3, 0, 6, N, 1, false); }
    if (!(mask & E1)) { p.dbox(N - 3, 0, 3, N, 1); p.ddither(N - 9, 0, 6, N, 1, true); }
    roundEdges(p, mask, 10);
    p.set(null);
  },

  // すな
  "~": (p, mask, v0) => {
    const v = v0 | 0, N = p.N;
    p.ffill(0);
    p.dnoise(5 + v * 29, 280, 1, 0, 0, N, N);
    p.dnoise(19 + v * 61, 100, 2, 0, 0, N, N);
    if (v % 8 === 2) { p.dbox(24, 36, 10, 2, 2); p.dbox(26, 38, 6, 2, 2); }
    if (v % 8 === 5) { p.dbox(44, 16, 8, 2, 2); }
    p.set(p.ground || "grass");
    if (!(mask & N1)) { p.dbox(0, 0, N, 2, 1); p.ddither(0, 2, N, 8, 1, false); }
    if (!(mask & S1)) { p.dbox(0, N - 2, N, 2, 1); p.ddither(0, N - 10, N, 8, 1, true); }
    if (!(mask & W1)) { p.dbox(0, 0, 2, N, 1); p.ddither(2, 0, 8, N, 1, false); }
    if (!(mask & E1)) { p.dbox(N - 2, 0, 2, N, 1); p.ddither(N - 10, 0, 8, N, 1, true); }
    roundEdges(p, mask, 11);
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
  T: (p, mask, v0) => {
    const v = v0 | 0;
    p.set("grass");
    p.ffill(1); p.fnoise(3 + (v | 0) * 41, 60, 0, 0, 0, 32, 32);
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
    const vv = (v | 0) % 3;
    p.fcorner(9 + vv * 3, t + 7 + vv, 7, 0);
    p.fcorner(22 - vv * 2, t + 13 - vv, 6, 0);
    p.fdither(l + 1, t + 10, r - l - 2, 10, 2, true);
    p.fdither(l + 1, b - 6, r - l - 2, 6, 2, false);
    // ふち（となりに きが ないところ だけ）
    if (!(mask & 1)) { p.fbox(l, t, r - l, 1, 3); p.f(l, t + 1, 3); p.f(r - 1, t + 1, 3); }
    if (!(mask & 4)) { p.fbox(l, b - 1, r - l, 1, 3); }
    if (!(mask & 8)) { p.fbox(l, t, 1, b - t, 3); }
    if (!(mask & 2)) { p.fbox(r - 1, t, 1, b - t, 3); }
    p.set(null);
  },

  // いわ＝がけ。うえに いわが あれば かべ、なければ てっぺん
  R: (p, mask, v0) => {
    const v = v0 | 0;
    const N = 1, E = 2, S = 4, Wl = 8;
    p.set("grass");
    p.ffill(1); p.fnoise(9 + (v | 0) * 23, 50, 0, 0, 0, 32, 32);
    p.set("rock");
    const top = !(mask & N);
    const bot = !(mask & S);
    const y0 = top ? 8 : 0;
    if (top) {
      p.set("grass");
      p.fbox(0, 6, 32, 1, 3);               // くさの きわ（かべに おちる かげ）
      p.set("rock");
    }
    p.fbox(0, y0, 32, 32 - y0, 2);          // いわの かべ
    if (top) { p.fbox(0, y0 - 1, 32, 4, 1); p.fdither(0, y0 + 3, 32, 3, 1, false); }
    // いわの つみめ（よこの すじ）と ひび
    for (let y = y0 + 5; y < 30; y += 7) {
      p.fbox(0, y, 32, 1, 3);
      p.fdither(0, y + 1, 32, 2, 1, false);
      const off = ((y + v * 3) % 5) * 3;
      for (let x = off; x < 32; x += 13) p.fbox(x, y - 4, 1, 4, 3);
    }
    if (bot) {                              // ねもとほど くらく
      p.fdither(0, 20, 32, 6, 3, false);
      p.fbox(0, 26, 32, 6, 3);
    }
    if (!(mask & Wl)) { p.fbox(0, y0, 2, 32 - y0, 3); p.fbox(2, y0, 1, 32 - y0, 1); }
    if (!(mask & E)) { p.fbox(30, y0, 2, 32 - y0, 3); p.fbox(29, y0, 1, 32 - y0, 1); }
    p.set(null);
  },

  // ひくい だんさ（下へ とびおりられる）
  L: (p, mask, v0) => {
    const v = v0 | 0;
    p.set("grass");
    p.ffill(1); p.fnoise(13 + v * 31, 50, 0, 0, 0, 32, 32);   // 上の だんの くさ
    p.fbox(0, 6, 32, 1, 3);               // くさの きわ（かべに おちる かげ）
    p.set("ledge");
    p.fbox(0, 7, 32, 18, 2);              // つちの かべ
    p.fbox(0, 7, 32, 3, 1);               // 日の あたる ところ
    p.fdither(0, 10, 32, 3, 1, false);
    // つちの そうと ひび
    for (let x = (v * 5) % 7; x < 32; x += 9) { p.fbox(x, 11, 1, 6, 3); p.fbox(x + 4, 17, 1, 5, 3); }
    p.fdither(0, 18, 32, 4, 3, false);
    p.fbox(0, 22, 32, 3, 3);              // ねもと（いちばん くらい）
    p.set("grass");
    p.fbox(0, 27, 32, 2, 3);              // 下の だんに おちる かげ
    p.fdither(0, 29, 32, 3, 3, false);
    p.set(null);
  },

  // かいだん（のぼりおり できる）
  H: (p, mask) => {
    const E = 2, Wl = 8;
    p.set("grass");
    p.ffill(1); p.fnoise(21, 50, 0, 0, 0, 32, 32);
    p.set("rock");
    const wl = !(mask & Wl), wr = !(mask & E);
    const x0 = wl ? 3 : 0, x1 = wr ? 29 : 32;
    p.fbox(x0, 4, x1 - x0, 23, 1);        // いしの きざはし
    for (let i = 0; i < 4; i++) {         // 4だん
      const y = 4 + i * 6;
      p.fbox(x0, y, x1 - x0, 2, 0);       // ふみめんの かど（日が あたる）
      p.fbox(x0, y + 4, x1 - x0, 2, 2);   // けあげの かげ
    }
    p.fbox(x0, 3, x1 - x0, 1, 3);         // 上の ふち
    p.fbox(x0, 25, x1 - x0, 2, 3);        // 下の ふち
    if (wl) p.fbox(0, 3, 3, 24, 3);
    if (wr) p.fbox(29, 3, 3, 24, 3);
    p.set("grass");
    p.fbox(0, 27, 32, 1, 3);              // 下の じめんに おちる かげ
    p.fdither(0, 28, 32, 2, 3, false);
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

  S: (p, mask, v) => {
    p.set(p.ground || "grass");
    PAINT[","](p, 15, v);
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
  T: "tree", R: "rock", W: "water", L: "ledge", H: "rock", "=": "fence",
  "#": "wall", r: "roof", w: "wall", D: "door", S: "sign", s: "sign",
  C: "cave", X: "cave", u: "wood", d: "wood", m: "rock",
  f: "floor", g: "carpet", x: "carpet", c: "wood", b: "wood", t: "wood",
  B: "floor", K: "machine", P: "machine", V: "plant",
};

// override は マップごとの いろちがい（やねの 色など）
export function tileFor(ch, frame, override, mask, variant, shade, tx, ty) {
  const set = (override && override[ch]) || TILE_SET[ch] || "path";
  const m = mask == null ? 255 : mask;
  const v = variant | 0;
  const sh = shade ? 1 : 0;
  const name = (ch === "W" && frame) ? "W2" : ch;
  const f0 = (ch === "W" && frame) ? PAINT.W2 : (PAINT[ch] || PAINT["."]);
  // くさは ばしょで 色むらが かわるので、ばしょも 名まえに いれる
  const pos = (ch === "," || ch === "F") ? "@" + (tx | 0) + "," + (ty | 0) : "";
  // きわを ぼかす とき、まわりの じめん（まちでは すな など）の 色を つかう
  const ground = (override && override[","]) || "grass";
  const f = (p) => {
    p.tx = tx | 0; p.ty = ty | 0;
    p.ground = ground;
    f0(p, m, v);
    if (sh) { p.fbox(0, 0, 32, 4, 3); p.fdither(0, 4, 32, 4, 3, false); }   // がけの かげ
  };
  return tileCanvas(name + "#" + m + "v" + v + (sh ? "s" : "") + pos + "~" + ground, f, set);
}

export function tileSet(ch) { return TILE_SET[ch] || "path"; }
export function solid(ch) { return SOLID.has(ch); }
