// 入り組んだ 地形を つくる どうぐ（かいはつ用）
//  ・木の かべは あつさが ばらばら、内がわの ふちは ぎざぎざ
//  ・川や 池は くねくね、いわは かたまりで ちらばる
//  ・道は まがりながら 入口どうしを つなぐ
//  ・NPC・かんばん・おとしもの・出入口の マスは かならず 通れる ように のこす
const W = 16;

function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

function make(H, floor) { return Array.from({ length: H }, () => new Array(W).fill(floor || ",")); }
const inside = (x, y, H) => x >= 0 && x < W && y >= 0 && y < H;

/* --- 木の かべ（あつさが ばらばら、ふちが ぎざぎざ） --- */
function border(g, r, H, ch) {
  const c = ch || "T";
  for (let x = 0; x < W; x++) {
    const t = 1 + (r() < 0.45 ? 1 : 0) + (r() < 0.15 ? 1 : 0);
    for (let i = 0; i < t; i++) { g[i][x] = c; }
    const b = 1 + (r() < 0.45 ? 1 : 0) + (r() < 0.15 ? 1 : 0);
    for (let i = 0; i < b; i++) { g[H - 1 - i][x] = c; }
  }
  for (let y = 0; y < H; y++) {
    const t = 1 + (r() < 0.5 ? 1 : 0) + (r() < 0.2 ? 1 : 0);
    for (let i = 0; i < t; i++) g[y][i] = c;
    const b = 1 + (r() < 0.5 ? 1 : 0) + (r() < 0.2 ? 1 : 0);
    for (let i = 0; i < b; i++) g[y][W - 1 - i] = c;
  }
}

/* --- くねくね した 帯（川・道など） --- */
function snake(g, r, H, opt) {
  const ch = opt.ch, wide = opt.wide || 2;
  let x = opt.x0, y = opt.y0;
  const dirY = opt.y1 > opt.y0 ? 1 : -1;
  const steps = Math.abs(opt.y1 - opt.y0);
  for (let i = 0; i <= steps; i++) {
    const w = Math.max(1, wide + (r() < 0.3 ? 1 : 0) - (r() < 0.25 ? 1 : 0));
    for (let k = 0; k < w; k++) {
      const xx = x + k - Math.floor(w / 2);
      if (inside(xx, y, H)) g[y][xx] = ch;
    }
    // よこにも すこし ふくらむ
    if (r() < 0.35 && inside(x + 2, y, H)) g[y][x + 2] = ch;
    if (r() < 0.35 && inside(x - 2, y, H)) g[y][x - 2] = ch;
    y += dirY;
    x += r() < 0.34 ? -1 : r() < 0.68 ? 1 : 0;
    x = Math.max(3, Math.min(W - 4, x));
  }
}

/* --- まるくない かたまり（池・いわ・くさむら） --- */
function blob(g, r, H, cx, cy, size, ch) {
  const pts = [[cx, cy]];
  const seen = new Set([cx + "," + cy]);
  while (pts.length && seen.size < size) {
    const i = Math.floor(r() * pts.length);
    const [x, y] = pts[i];
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]];
    const [dx, dy] = dirs[Math.floor(r() * dirs.length)];
    const nx = x + dx, ny = y + dy;
    const key = nx + "," + ny;
    if (!inside(nx, ny, H) || seen.has(key)) { if (r() < 0.3) pts.splice(i, 1); continue; }
    seen.add(key); pts.push([nx, ny]);
  }
  for (const k of seen) {
    const [x, y] = k.split(",").map(Number);
    if (!inside(x, y, H)) continue;
    if (ch !== "W" && g[y][x] === "W") continue;   // みずの かたちを こわさない
    g[y][x] = ch;
  }
  return seen;
}

/* --- みずの かたちを ととのえる ---
   1マスだけ とび出た みずを けし、みずに かこまれた あなを うめる。
   こうすると 石の わくが きれいに 池を かこみます。 */
function smoothWater(g, H, onlyDrop) {
  // ちいさすぎる みずたまりは けす（6マスより 小さい かたまり）
  const drop = () => {
    const seen = new Set();
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (g[y][x] !== "W" || seen.has(x + "," + y)) continue;
      const q = [[x, y]], cells = [];
      seen.add(x + "," + y);
      while (q.length) {
        const c = q.pop(); cells.push(c);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = c[0] + dx, ny = c[1] + dy;
          if (!inside(nx, ny, H) || g[ny][nx] !== "W" || seen.has(nx + "," + ny)) continue;
          seen.add(nx + "," + ny); q.push([nx, ny]);
        }
      }
      if (cells.length < 6) for (const [cx, cy] of cells) g[cy][cx] = FLOOR;
    }
  };
  if (!onlyDrop) for (let pass = 0; pass < 3; pass++) {
    const c = g.map((r) => r.slice());
    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        const n = [[1, 0], [-1, 0], [0, 1], [0, -1]]
          .filter(([dx, dy]) => c[y + dy][x + dx] === "W").length;
        if (c[y][x] === "W" && n <= 1) g[y][x] = FLOOR;        // ほそい ところを けす
        else if (c[y][x] !== "W" && n >= 3) g[y][x] = "W";      // あなを うめる
      }
    }
  }
  drop();
}

/* --- 通れるか --- */
const SOLID = new Set(["T", "R", "W", "X", "=", "S", "s"]);
function walkable(ch) { return !SOLID.has(ch); }

/* --- あるいて とどく ところを しらべる --- */
function reach(g, H, sx, sy) {
  const seen = new Set([sx + "," + sy]);
  const q = [[sx, sy]];
  while (q.length) {
    const [x, y] = q.pop();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      let nx = x + dx, ny = y + dy;
      if (!inside(nx, ny, H)) continue;
      const c = g[ny][nx];
      if (c === "L") { if (dy !== 1) continue; ny += 1; if (!inside(nx, ny, H) || !walkable(g[ny][nx])) continue; }
      else if (!walkable(c)) continue;
      const key = nx + "," + ny;
      if (seen.has(key)) continue;
      seen.add(key); q.push([nx, ny]);
    }
  }
  return seen;
}

/* --- まっすぐ ほる（つながっていない ときの たすけ） --- */
let FLOOR = ",";
function dig(g, x0, y0, x1, y1) {
  let x = x0, y = y0;
  while (x !== x1 || y !== y1) {
    if (SOLID.has(g[y][x])) g[y][x] = FLOOR;
    if (x !== x1) x += x < x1 ? 1 : -1;
    else if (y !== y1) y += y < y1 ? 1 : -1;
  }
  if (SOLID.has(g[y][x])) g[y][x] = FLOOR;
}

/* ============================================================
   1まいの 地形を つくる
   opt: { seed, H, keep:[[x,y]...], doors:[[x,y]...], theme }
============================================================ */
function generate(opt) {
  const H = opt.H, r = rng(opt.seed);
  const th = opt.theme || {};
  FLOOR = th.floor || ",";
  for (let tries = 0; tries < 40; tries++) {
    const g = make(H, th.floor);
    border(g, r, H, th.border || "T");

    // 道（入口どうしを くねくね つなぐ）
    if (opt.doors.length >= 2) {
      const a = opt.doors[0], b = opt.doors[1];
      let x = a[0], y = a[1];
      const dirY = b[1] > a[1] ? 1 : -1;
      while (y !== b[1]) {
        const w = 1 + (r() < 0.4 ? 1 : 0);
        for (let k = 0; k < w; k++) if (inside(x + k, y, H)) g[y][x + k] = th.path || FLOOR;
        y += dirY;
        if (r() < 0.45) x += r() < 0.5 ? -1 : 1;
        x = Math.max(2, Math.min(W - 3, x));
      }
      dig(g, x, y, b[0], b[1]);
    }

    // 川・池
    for (let i = 0; i < (th.water || 0); i++) {
      if (r() < 0.5) snake(g, r, H, { ch: "W", x0: 3 + Math.floor(r() * 9), y0: 2, y1: H - 3, wide: 2 });
      else blob(g, r, H, 3 + Math.floor(r() * 10), 3 + Math.floor(r() * (H - 6)), 8 + Math.floor(r() * 14), "W");
    }
    // いわ
    for (let i = 0; i < (th.rock || 0); i++) {
      blob(g, r, H, 2 + Math.floor(r() * 12), 2 + Math.floor(r() * (H - 4)), 2 + Math.floor(r() * 4), "R");
    }
    // くさむら（たかい くさ）
    for (let i = 0; i < (th.grass || 0); i++) {
      blob(g, r, H, 2 + Math.floor(r() * 12), 2 + Math.floor(r() * (H - 4)), 6 + Math.floor(r() * 12), '"');
    }
    // すな・つち
    for (let i = 0; i < (th.sand || 0); i++) {
      blob(g, r, H, 2 + Math.floor(r() * 12), 2 + Math.floor(r() * (H - 4)), 10 + Math.floor(r() * 16), th.sandCh || "~");
    }
    // 木の かたまり（中にも もりを おく）
    for (let i = 0; i < (th.grove || 0); i++) {
      blob(g, r, H, 3 + Math.floor(r() * 10), 3 + Math.floor(r() * (H - 6)), 3 + Math.floor(r() * 5), "T");
    }
    // さく（よこに ならべる）
    for (let i = 0; i < (th.fence || 0); i++) {
      const len = 3 + Math.floor(r() * 4);
      const x = 2 + Math.floor(r() * (W - 4 - len));
      const y = 2 + Math.floor(r() * (H - 4));
      let can = true;
      for (let k = 0; k < len; k++) if (g[y][x + k] !== (th.floor || ",")) can = false;
      if (!can) continue;
      for (let k = 0; k < len; k++) g[y][x + k] = "=";
    }
    if (th.water) smoothWater(g, H);
    // 花
    for (let i = 0; i < (th.flower || 0); i++) {
      const x = 2 + Math.floor(r() * 12), y = 2 + Math.floor(r() * (H - 4));
      if (g[y][x] === ",") g[y][x] = "F";
    }

    // かならず 通れる ように のこす ところ
    for (const [x, y, ch] of opt.keep) {
      if (!inside(x, y, H)) continue;
      g[y][x] = ch || FLOOR;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (inside(nx, ny, H) && (nx > 0 && nx < W - 1 && ny > 0 && ny < H - 1) && SOLID.has(g[ny][nx])) g[ny][nx] = th.floor || ",";
      }
    }
    // 入口は 中まで ほって、かべに ふさがれない ように する
    for (const [x, y] of opt.doors) {
      if (!inside(x, y, H)) continue;
      g[y][x] = th.path || FLOOR;
      const tx = x < 3 ? x + 3 : x > W - 4 ? x - 3 : x;
      const ty = y < 3 ? y + 3 : y > H - 4 ? y - 3 : y;
      dig(g, x, y, tx, ty);
    }

    if (th.water) smoothWater(g, H, true);   // 道で きられた ちいさな みずを けす

    // ぜんぶ あるいて いけるか
    const start = opt.doors[0];
    const seen = reach(g, H, start[0], start[1]);
    let ok = true;
    for (const [x, y] of opt.doors) if (!seen.has(x + "," + y)) ok = false;
    for (const [x, y, ch] of opt.keep) {
      if (ch && SOLID.has(ch)) {                       // かんばんなど：となりに 立てれば よい
        const near = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => seen.has((x + dx) + "," + (y + dy)));
        if (!near) ok = false;
      } else if (!seen.has(x + "," + y)) ok = false;
    }
    if (ok) return g.map((row) => row.join(""));
  }
  throw new Error("地形を つくれませんでした seed=" + opt.seed);
}

module.exports = { generate, W };
