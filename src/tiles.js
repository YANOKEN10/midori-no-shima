// ============================================================
//  マスの え（1マス＝16x16ドットを 2ばいに して 32x32）
//   ゲームボーイカラーと おなじで、マスごとに いろセットを もちます。
//   p.set("wood") のように とちゅうで べつの セットにも できます。
// ============================================================
import { tileCanvas } from "./gfx.js";

// とおれるか / しらべられるか
export const SOLID = new Set(["T", "R", "M", "W", "#", "r", "w", "S", "X", "=", "c", "b", "t", "K", "V", "P", "s"]);
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

/* --- マスの かどを まるく けずる ---
   まわり 8マスを 見て、そとがわの かどは まるく けずり、
   けずった ふちには 色を のせます。いわ・みずが 四角く 見えない ように。 */
function roundCut(p, mask, R, ground, edgeIdx) {
  const N = 1, E = 2, S = 4, Wl = 8, NE = 16, SE = 32, SW = 64, NW = 128;
  const M = p.N - 1;
  const corner = (cx, cy, sx, sy, on) => {
    if (!on) return;
    p.set(ground);
    for (let j = 0; j < R; j++) {
      for (let i = 0; i < R; i++) {
        const dx = R - (i + 0.5), dy = R - (j + 0.5);
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > R) p.d(cx + sx * i, cy + sy * j, 1);
        else if (d > R - 1.4 && ((cx + sx * i + cy + sy * j) % 2 === 0)) p.d(cx + sx * i, cy + sy * j, 1);
      }
    }
    p.set(null);
    if (edgeIdx == null) return;
    for (let j = 0; j < R; j++) {
      for (let i = 0; i < R; i++) {
        const dx = R - (i + 0.5), dy = R - (j + 0.5);
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d <= R - 1 && d > R - 3.5) p.d(cx + sx * i, cy + sy * j, edgeIdx);
      }
    }
  };
  const notch = (cx, cy, sx, sy, on) => {          // 内がわの かど（ななめだけ ちがう）
    if (!on) return;
    p.set(ground);
    for (let j = 0; j < 8; j++) for (let i = 0; i < 8 - j; i++) if (i + j < 6) p.d(cx + sx * i, cy + sy * j, 1);
    p.set(null);
  };
  corner(0, 0, 1, 1, !(mask & N) && !(mask & Wl));
  corner(M, 0, -1, 1, !(mask & N) && !(mask & E));
  corner(0, M, 1, -1, !(mask & S) && !(mask & Wl));
  corner(M, M, -1, -1, !(mask & S) && !(mask & E));
  notch(0, 0, 1, 1, (mask & N) && (mask & Wl) && !(mask & NW));
  notch(M, 0, -1, 1, (mask & N) && (mask & E) && !(mask & NE));
  notch(0, M, 1, -1, (mask & S) && (mask & Wl) && !(mask & SW));
  notch(M, M, -1, -1, (mask & S) && (mask & E) && !(mask & SE));
}

// みずべの 丸石。16ドットごとに ずらして、タイルの ます目を 目立たせない。
function stoneBank(p, seed) {
  const NP = p.N;
  p.set("stone");
  p.ffill(1);
  p.dnoise(seed, 150, 0, 0, 0, NP, NP);
  for (let y = -6; y < NP + 10; y += 12) {
    const off = ((y / 12) & 1) ? 8 : 0;
    for (let x = -8 + off; x < NP + 8; x += 16) {
      p.dbox(x + 2, y + 2, 12, 8, 2);
      p.dbox(x + 3, y + 2, 10, 2, 0);
      p.dbox(x + 2, y + 4, 2, 4, 0);
      p.dbox(x + 4, y + 8, 9, 2, 3);
      p.dbox(x + 13, y + 4, 2, 5, 3);
      if (((x + y + seed) & 31) === 0) p.dbox(x + 7, y + 5, 2, 2, 0);
    }
  }
}

function waterLines(p, x0, y0, x1, y1, phase) {
  p.set("water");
  const w = x1 - x0, h = y1 - y0;
  p.dbox(x0, y0, w, h, 1);
  p.ddither(x0, y0, w, h, 2, Boolean(phase));
  for (let y = y0 + 7 + phase * 3; y < y1 - 3; y += 13) {
    const shift = ((y + phase * 11) % 19);
    for (let x = x0 - 8 + shift; x < x1; x += 26) {
      const len = Math.min(15, x1 - x);
      if (len > 3) {
        p.dbox(Math.max(x, x0), y, len, 1, 0);
        p.dbox(Math.max(x + 3, x0), y + 1, Math.max(1, len - 6), 1, 0);
        p.d(Math.max(x + len - 2, x0), y + 2, 2);
      }
    }
  }
}

const PAINT = {
  /* ---------------- じめん ---------------- */
  // くさ（ふつう）
  ",": (p, mask, v0) => {
    const v = v0 | 0, N = p.N;
    p.ffill(1);
    // DS世代風に、全面の網目ではなく小さな葉の房と明暗パッチで地面を作る。
    patch(p, 0, 54, 0.64);
    patch(p, 97, 34, 0.72);
    p.dnoise(11 + v * 37, 72, 0, 0, 0, N, N);
    p.dnoise(23 + v * 91, 38, 2, 0, 0, N, N);
    const tuft = (x, y) => {
      p.dbox(x, y + 2, 2, 4, 2);
      p.dbox(x - 3, y + 4, 2, 3, 2); p.dbox(x + 3, y + 4, 2, 3, 2);
      p.dbox(x, y + 1, 1, 2, 0); p.d(x - 3, y + 3, 0); p.d(x + 4, y + 3, 0);
      p.dbox(x - 3, y + 7, 8, 1, 2);
    };
    const sets = [[[12, 14], [52, 38]],
                  [[35, 18], [19, 56]],
                  [[49, 25], [11, 44]],
                  [[17, 8], [45, 35]]];
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
  },

  // たかい くさ（ガオンが でる）：こい くさむらに ふさが たくさん
  '"': (p, mask, v0) => {
    const v = v0 | 0, N = p.N;
    p.set("tallgrass");
    p.ffill(1);
    p.dnoise(11 + v * 29, 84, 2, 0, 0, N, N);
    p.dbox(0, 54, N, 10, 2);
    p.ddither(0, 46, N, 12, 2, false);
    const tuft = (x, y) => {
      p.dbox(x - 5, y + 8, 3, 12, 3); p.dbox(x + 5, y + 8, 3, 12, 3);
      p.dbox(x, y + 2, 3, 19, 0);
      p.dbox(x - 7, y + 6, 3, 15, 0); p.dbox(x + 7, y + 6, 3, 15, 0);
      p.dbox(x - 3, y + 10, 2, 11, 1); p.dbox(x + 4, y + 10, 2, 11, 1);
      p.d(x + 1, y, 0); p.d(x - 6, y + 4, 0); p.d(x + 8, y + 4, 0);
      p.dbox(x - 7, y + 21, 18, 2, 3);
    };
    const sets = [[[12, 10], [40, 16], [24, 36], [52, 40]],
                  [[18, 14], [46, 8], [10, 38], [36, 42]],
                  [[30, 6], [54, 22], [14, 32], [42, 46]],
                  [[8, 18], [34, 12], [56, 34], [20, 44]]];
    for (const [x, y] of sets[v % 4]) tuft(x, y);
    roundCut(p, mask, 16, p.ground || "grass", null);   // くさむらの かどを まるく
    p.set(null);
  },

  // つち・みち（まわりが みちで なければ ふちを ぼかす）
  ".": (p, mask, v0) => {
    const v = v0 | 0, N = p.N;
    p.ffill(0);
    p.dnoise(7 + v * 53, 92, 1, 0, 0, N, N);
    p.dnoise(31 + v * 17, 38, 2, 0, 0, N, N);
    // うすい轍と小石。タイル境界をまたぐ位置に置き、道を連続して見せる。
    if ((mask & N1) && (mask & S1)) {
      p.ddither(13, 0, 4, N, 1, Boolean(v & 1));
      p.ddither(N - 17, 0, 4, N, 1, !Boolean(v & 1));
    }
    if ((mask & W1) && (mask & E1)) {
      p.ddither(0, 13, N, 4, 1, Boolean(v & 1));
      p.ddither(0, N - 17, N, 4, 1, !Boolean(v & 1));
    }
    if (v % 8 === 3) { p.dbox(40, 24, 6, 3, 2); p.dbox(42, 22, 2, 2, 2); p.d(47, 27, 1); }
    if (v % 8 === 6) { p.dbox(14, 44, 5, 3, 2); p.dbox(15, 43, 2, 1, 1); }
    p.set(p.ground || "grass");
    if (!(mask & N1)) { p.dbox(0, 0, N, 4, 1); p.ddither(0, 4, N, 7, 1, false); }
    if (!(mask & S1)) { p.dbox(0, N - 4, N, 4, 1); p.ddither(0, N - 11, N, 7, 1, true); }
    if (!(mask & W1)) { p.dbox(0, 0, 4, N, 1); p.ddither(4, 0, 7, N, 1, false); }
    if (!(mask & E1)) { p.dbox(N - 4, 0, 4, N, 1); p.ddither(N - 11, 0, 7, N, 1, true); }
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
    const NP = p.N, B = 9, R = 18;
    stoneBank(p, 17);
    // 中の みず
    const x0 = (mask & W1) ? 0 : B, x1 = (mask & E1) ? NP : NP - B;
    const y0 = (mask & N1) ? 0 : B, y1 = (mask & S1) ? NP : NP - B;
    waterLines(p, x0, y0, x1, y1, 0);
    // みずの きわを 石の 内がわに そって くらく（石わくの ある がわ だけ）
    if (!(mask & N1)) p.dbox(x0, y0, x1 - x0, 2, 2);
    if (!(mask & S1)) p.dbox(x0, y1 - 2, x1 - x0, 2, 2);
    if (!(mask & W1)) p.dbox(x0, y0, 2, y1 - y0, 2);
    if (!(mask & E1)) p.dbox(x1 - 2, y0, 2, y1 - y0, 2);
    // 石の わくの ふち（うちがわ）
    p.set("stone");
    if (!(mask & N1)) p.dbox(x0 - 2, y0 - 2, (x1 - x0) + 4, 2, 3);
    if (!(mask & S1)) p.dbox(x0 - 2, y1, (x1 - x0) + 4, 2, 3);
    if (!(mask & W1)) p.dbox(x0 - 2, y0 - 2, 2, (y1 - y0) + 4, 3);
    if (!(mask & E1)) p.dbox(x1, y0 - 2, 2, (y1 - y0) + 4, 3);
    roundCut(p, mask, R, p.ground || "grass", null);
    p.set(null);
  },
  W2: (p, mask) => {
    const NP = p.N, B = 9, R = 18;
    stoneBank(p, 41);
    // 中の みず
    const x0 = (mask & W1) ? 0 : B, x1 = (mask & E1) ? NP : NP - B;
    const y0 = (mask & N1) ? 0 : B, y1 = (mask & S1) ? NP : NP - B;
    waterLines(p, x0, y0, x1, y1, 1);
    // みずの きわを 石の 内がわに そって くらく（石わくの ある がわ だけ）
    if (!(mask & N1)) p.dbox(x0, y0, x1 - x0, 2, 2);
    if (!(mask & S1)) p.dbox(x0, y1 - 2, x1 - x0, 2, 2);
    if (!(mask & W1)) p.dbox(x0, y0, 2, y1 - y0, 2);
    if (!(mask & E1)) p.dbox(x1 - 2, y0, 2, y1 - y0, 2);
    // 石の わくの ふち（うちがわ）
    p.set("stone");
    if (!(mask & N1)) p.dbox(x0 - 2, y0 - 2, (x1 - x0) + 4, 2, 3);
    if (!(mask & S1)) p.dbox(x0 - 2, y1, (x1 - x0) + 4, 2, 3);
    if (!(mask & W1)) p.dbox(x0 - 2, y0 - 2, 2, (y1 - y0) + 4, 3);
    if (!(mask & E1)) p.dbox(x1, y0 - 2, 2, (y1 - y0) + 4, 3);
    roundCut(p, mask, R, p.ground || "grass", null);
    p.set(null);
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

  // いわ（R）：まるい いわ。となりあうと かたまりに 見える
  R: (p, mask, v0) => {
    const v = v0 | 0, N = p.N;
    p.set(p.ground || "grass");
    p.ffill(1);
    p.dnoise(9 + v * 23, 140, 0, 0, 0, N, N);
    // じめんに おちる かげ
    p.set(p.name || "rock");
    const cx = N / 2 + ((v % 3) - 1), cy = N / 2 + 3;
    const rx = N / 2 - 1, ry = N / 2 - 3;
    const ell = (ox, oy, rrx, rry, col) => {
      for (let y = Math.floor(oy - rry); y <= Math.ceil(oy + rry); y++) {
        const t = (y - oy) / rry;
        if (Math.abs(t) > 1) continue;
        const w = Math.round(rrx * Math.sqrt(1 - t * t));
        p.dbox(Math.round(ox - w), y, w * 2, 1, col);
      }
    };
    p.set(p.ground || "grass");
    // じめんに おちる かげ（ちいさく、あみかけで やわらかく）
    p.ddither(Math.round(cx - rx * 0.7) + 2, Math.round(cy + ry - 6), Math.round(rx * 1.4), 7, 2, false);
    ell(cx + 2, cy + ry - 3, rx * 0.7, 2.5, 2);
    p.set(p.name || "rock");
    ell(cx, cy, rx, ry, 3);                            // ふち
    ell(cx, cy - 1, rx - 2, ry - 2, 1);                // 本体
    ell(cx - rx * 0.3, cy - ry * 0.5, rx * 0.5, ry * 0.42, 0);   // 日なた
    p.ddither(Math.round(cx - rx * 0.8), Math.round(cy - ry * 0.9), Math.round(rx * 1.1), Math.round(ry * 0.6), 0, false);
    // 下がわの かげ
    p.ddither(Math.round(cx - rx * 0.7), Math.round(cy + ry * 0.1), Math.round(rx * 1.4), Math.round(ry * 0.7), 2, true);
    ell(cx, cy + 2, rx - 3, ry - 4, 2);
    ell(cx, cy - 1, rx - 2, ry - 2, 1);
    ell(cx - rx * 0.28, cy - ry * 0.45, rx * 0.42, ry * 0.36, 0);
    // ひび
    p.dbox(Math.round(cx + rx * 0.2), Math.round(cy - ry * 0.1), 1, Math.round(ry * 0.5), 2);
    p.dbox(Math.round(cx + rx * 0.2) + 1, Math.round(cy + ry * 0.2), Math.round(rx * 0.3), 1, 2);
    p.set(null);
  },

  // がけ（M）：うえに がけが あれば かべ、なければ てっぺん
  M: (p, mask, v0) => {
    const v = v0 | 0;
    const N = 1, E = 2, S = 4, Wl = 8;
    p.set(p.ground || "grass");
    p.ffill(1); p.fnoise(9 + (v | 0) * 23, 50, 0, 0, 0, 32, 32);
    p.set("rock");
    const top = !(mask & N);
    const bot = !(mask & S);
    const y0 = top ? 8 : 0;
    if (top) {
      p.set(p.ground || "grass");
      p.fbox(0, 6, 32, 1, 3);               // じめんの きわ（かべに おちる かげ）
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
    // よこの ふち（かべの ぶん だけ）
    const RN = p.N, wallTop = y0 * 2;
    if (!(mask & Wl)) { p.dbox(0, wallTop, 4, RN - wallTop, 3); p.dbox(4, wallTop, 2, RN - wallTop, 1); }
    if (!(mask & E)) { p.dbox(RN - 4, wallTop, 4, RN - wallTop, 3); p.dbox(RN - 6, wallTop, 2, RN - wallTop, 1); }
    // かべの 下がわの かどだけ まるく（上は じめんなので さわらない）
    if (!(mask & S)) {
      const R = 14;
      const round = (cx, sx) => {
        p.set(p.ground || "grass");
        for (let j = 0; j < R; j++) {
          for (let i = 0; i < R; i++) {
            const dx = R - (i + 0.5), dy = R - (j + 0.5);
            if (Math.sqrt(dx * dx + dy * dy) > R) p.d(cx + sx * i, RN - 1 - j, 1);
          }
        }
        p.set("rock");
      };
      if (!(mask & Wl)) round(0, 1);
      if (!(mask & E)) round(RN - 1, -1);
    }
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

  // かいだん（のぼりおり できる）：上は 上の じめんに つながる
  H: (p, mask) => {
    const E = 2, Wl = 8, N = p.N;
    const wl = !(mask & Wl), wr = !(mask & E);
    const x0 = wl ? 5 : 0, x1 = wr ? N - 5 : N;
    // 上がわは 上の だんの じめん（つながって 見えるように）
    p.set(p.ground || "grass");
    p.ffill(1);
    p.dnoise(21, 160, 0, 0, 0, N, N);
    p.set("rock");
    // きざはし（上の だんから 下の だんへ 4だん）
    const top = 14, bottom = 50;   // となりの だんさ（L）と 高さを あわせる
    p.dbox(x0, top, x1 - x0, bottom - top, 1);
    for (let i = 0; i < 4; i++) {
      const y = top + Math.round(i * (bottom - top) / 4);
      const h = Math.round((bottom - top) / 4);
      p.dbox(x0, y, x1 - x0, 2, 0);                      // ふみめんの かど（日なた）
      p.ddither(x0, y + 2, x1 - x0, 2, 0, false);
      p.dbox(x0, y + h - 3, x1 - x0, 3, 2);              // けあげの かげ
      p.dbox(x0, y + h - 1, x1 - x0, 1, 3);
    }
    p.dbox(x0, top - 2, x1 - x0, 2, 3);                  // 上の きわ
    p.dbox(x0, bottom - 2, x1 - x0, 2, 3);               // 下の きわ
    if (wl) { p.dbox(0, top - 2, 5, bottom - top + 4, 2); p.dbox(0, top - 2, 2, bottom - top + 4, 3); }
    if (wr) { p.dbox(N - 5, top - 2, 5, bottom - top + 4, 2); p.dbox(N - 2, top - 2, 2, bottom - top + 4, 3); }
    // 下の じめんに おちる かげ
    p.set(p.ground || "grass");
    p.dbox(0, bottom, N, 2, 3);
    p.ddither(0, bottom + 2, N, 3, 3, false);
    p.set(null);
  },

  "=": (p, mask) => {
    const N = p.N;
    p.set(p.ground || "grass");
    PAINT[","](p, 15, 3);
    p.set("fence");
    // よこ木 2本
    p.dbox(0, 24, N, 5, 1); p.dbox(0, 24, N, 1, 0); p.dbox(0, 28, N, 1, 3);
    p.dbox(0, 38, N, 5, 1); p.dbox(0, 38, N, 1, 0); p.dbox(0, 42, N, 1, 3);
    // くい（左右の はしと まん中）
    for (const x of [4, 28, 52]) {
      p.dbox(x, 16, 7, 32, 1);
      p.dbox(x, 16, 2, 32, 0);
      p.dbox(x + 5, 16, 2, 32, 3);
      p.dbox(x, 16, 7, 2, 0);
      p.dbox(x - 1, 46, 9, 2, 3);
    }
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
  T: "tree", R: "rock", M: "rock", W: "water", L: "ledge", H: "rock", "=": "fence",
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
