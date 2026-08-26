// ============================================================
//  たてものを「何マスにも またがる 1まいの え」で えがく
//   ・マップの やね(r)の かたまりを 見つけて、その下の かべ(# w D)まで
//     ひとつの たてものとして あつかいます
//   ・マスの あたりはんていは これまでどおり タイルの ままです
// ============================================================
import * as G from "./gfx.js";

const T = G.TILE;
const cache = new Map();

function at(map, x, y) {
  if (y < 0 || y >= map.rows.length) return null;
  const row = map.rows[y];
  if (x < 0 || x >= row.length) return null;
  return row[x];
}

/* --- 地図から たてものを さがす --- */
export function findHouses(map) {
  if (map._houses) return map._houses;
  const seen = [];
  const houses = [];
  const isRoof = (x, y) => at(map, x, y) === "r";
  const isWall = (x, y) => { const c = at(map, x, y); return c === "#" || c === "w" || c === "D"; };

  for (let y = 0; y < map.rows.length; y++) {
    for (let x = 0; x < map.rows[y].length; x++) {
      if (!isRoof(x, y)) continue;
      if (seen.some(([sx, sy]) => sx === x && sy === y)) continue;
      // よこと たての ひろがりを しらべる
      let x1 = x;
      while (isRoof(x1 + 1, y)) x1++;
      let y1 = y;
      while (isRoof(x, y1 + 1)) y1++;
      // かべの ぶん
      let wy = y1;
      while (isWall(x, wy + 1)) wy++;
      for (let yy = y; yy <= wy; yy++) for (let xx = x; xx <= x1; xx++) seen.push([xx, yy]);

      const windows = [], doors = [];
      for (let yy = y1 + 1; yy <= wy; yy++) {
        for (let xx = x; xx <= x1; xx++) {
          const c = at(map, xx, yy);
          if (c === "w") windows.push([xx - x, yy - y]);
          if (c === "D") doors.push([xx - x, yy - y]);
        }
      }
      const rset = (map.sets && map.sets.r) || "roof";
      houses.push({
        x: x, y: y,
        w: x1 - x + 1, h: wy - y + 1,
        roofRows: y1 - y + 1,
        windows: windows, doors: doors,
        set: rset,
        style: roofStyle(map, x, y, x1 - x + 1, y1 - y + 1, rset),
      });
    }
  }
  map._houses = houses;
  return houses;
}


/* --- やねの かたちを えらぶ --- */
// きりづま=gable  よせむね=hip  かたながれ=shed  ほうぎょう=pyramid
// いりもや=irimoya  わらぶき=thatch
const STYLES = ["hip", "gable", "hip", "shed", "pyramid"];
function roofStyle(map, x, y, w, rows, set) {
  // 地図が かたちを していして いれば それに したがう
  if (map.roofs) {
    for (const r of map.roofs) if (r[0] === x && r[1] === y) return r[2];
  }
  if (map.roofStyle) return map.roofStyle;
  if (set === "wood") return "thatch";        // やまの むらは わらぶき
  if (w >= 7) return "irimoya";               // おおきい たてものは いりもや
  if (w <= 2) return "gable";
  const k = (x * 5 + y * 11 + w * 3 + rows * 7) % STYLES.length;
  return STYLES[k];
}

/* --- たてものの え --- */
export function houseImage(h) {
  const key = [h.w, h.h, h.roofRows, h.set, h.style, G.paletteName(),
               h.windows.join("|"), h.doors.join("|")].join(",");
  if (cache.has(key)) return cache.get(key);

  const W = h.w * T, H = h.h * T;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const c = cv.getContext("2d");
  c.imageSmoothingEnabled = false;

  const roof = G.resolve(h.set);
  const wall = G.resolve("wall");
  const door = G.resolve("door");
  const glass = G.resolve("water");
  const wood = G.resolve("wood");

  const fill = (x, y, w, hh, col) => { c.fillStyle = col; c.fillRect(x, y, w, hh); };
  const dither = (x, y, w, hh, col, odd) => {
    c.fillStyle = col;
    for (let j = 0; j < hh; j++) for (let i = 0; i < w; i++) {
      if (((x + i) + (y + j)) % 2 === (odd ? 1 : 0)) c.fillRect(x + i, y + j, 1, 1);
    }
  };

  const roofH = h.roofRows * T;
  const wallY = roofH;

  /* ---- かべ ---- */
  fill(0, wallY, W, H - wallY, wall[1]);
  // よこの いた
  for (let y = wallY + 4; y < H; y += 6) fill(0, y, W, 1, wall[2]);
  // かどの はしら
  fill(0, wallY, 3, H - wallY, wall[2]);
  fill(W - 3, wallY, 3, H - wallY, wall[2]);
  // ひかり
  dither(3, wallY, W - 6, 6, wall[0], false);
  // 下の かげ
  fill(0, H - 3, W, 3, wall[3]);

  /* ---- まど ---- */
  for (const [cx, cy] of h.windows) {
    const x = cx * T + 5, y = cy * T + 7;
    fill(x - 2, y - 2, 26, 22, wood[2]);
    fill(x, y, 22, 18, glass[2]);
    fill(x + 1, y + 1, 20, 16, glass[1]);
    dither(x + 1, y + 1, 9, 7, glass[0], false);
    fill(x + 10, y + 1, 2, 16, wood[2]);
    fill(x + 1, y + 8, 20, 2, wood[2]);
    fill(x - 3, y + 20, 28, 3, wood[3]);      // まどの さん
  }

  /* ---- ドア ---- */
  for (const [cx, cy] of h.doors) {
    const x = cx * T + 4, y = cy * T + 2;
    fill(x - 1, y - 1, 26, 32, door[3]);
    fill(x, y, 24, 30, door[1]);
    fill(x + 3, y + 4, 18, 24, door[2]);
    fill(x + 3, y + 4, 18, 1, door[3]);
    fill(x + 3, y + 15, 18, 1, door[3]);
    fill(x + 17, y + 17, 3, 3, roof[0]);      // ノブ
    fill(x - 3, y + 29, 30, 3, wall[2]);      // だんさ
  }

  /* ---- やね ---- */
  drawRoof(c, W, roofH, h.style, roof, wood);
  // やねの かげが かべに おちる
  dither(2, roofH, W - 4, 4, wall[3], false);

  cache.set(key, cv);
  return cv;
}


/* ============================================================
   やねを えがく
    ・まず「どの めん(ざひょう)か」に わけて（zone）
    ・めんごとに いろと かわらの すじの むきを かえる
    ・めんの さかいめが むね・すみむね（ななめの せん）になる
   ============================================================ */
const BACK = 0, FRONT = 1, LEFT = 2, RIGHT = 3;

function roofZones(W, H, style) {
  const z = new Uint8Array(W * H);
  if (style === "shed") { z.fill(FRONT); return { z: z, ridgeY: 0, x0: 0, x1: W - 1 }; }
  let run, ridgeY;                                   // run = すみむねの よこの ながさ
  if (style === "gable") { run = 0; ridgeY = Math.round(H * 0.40); }
  else if (style === "pyramid") { run = Math.floor(W / 2); ridgeY = Math.round(H * 0.42); }
  else {
    run = Math.max(5, Math.min(Math.round(H * 0.5), Math.round(W * 0.26)));
    ridgeY = Math.round(H * (style === "irimoya" ? 0.40 : 0.38));
  }
  const x0 = run, x1 = W - run;
  const backH = ridgeY, frontH = H - ridgeY;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let zone;
      if (run === 0) zone = (y < ridgeY) ? BACK : FRONT;
      else {
        const upL = (x * backH) / run;              // (0,0)→(x0,ridgeY)
        const loL = H - (x * frontH) / run;         // (0,H)→(x0,ridgeY)
        const upR = ((W - 1 - x) * backH) / run;
        const loR = H - ((W - 1 - x) * frontH) / run;
        if (x < x0 && y >= upL && y <= loL) zone = LEFT;
        else if (x >= x1 && y >= upR && y <= loR) zone = RIGHT;
        else zone = (y < ridgeY) ? BACK : FRONT;
      }
      z[y * W + x] = zone;
    }
  }
  return { z: z, ridgeY: ridgeY, x0: x0, x1: x1 };
}

function drawRoof(c, W, H, style, roof, wood) {
  const st = style || "hip";
  const g = roofZones(W, H, st);
  const z = g.z, ridgeY = g.ridgeY;
  if (st === "thatch") return thatchRoof(c, W, H, g, roof, wood);

  const col = new Uint8Array(W * H);        // 0..3=やねの いろ 8,9=木
  const at = (x, y) => z[y * W + x];
  const set = (x, y, v) => { if (x >= 0 && x < W && y >= 0 && y < H) col[y * W + x] = v; };

  /* ---- めんごとの じいろと ひかり・かげ ---- */
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const zone = at(x, y);
      const odd = (x + y) % 2 === 0;
      let v = (zone === FRONT) ? 1 : 2;
      if (zone === FRONT) {
        const d = y - ridgeY;                       // むねからの きょり
        if (d < 4) v = 0;
        else if (d < 7 && odd) v = 0;
        const e = H - y;                            // ひさしからの きょり
        if (e < 5) v = 2;
        else if (e < 8 && odd) v = 2;
      } else if (zone === BACK) {
        if (ridgeY - y < 4 && odd) v = 1;
      } else {
        const edge = zone === LEFT ? x : W - 1 - x;
        if (edge < 3) v = 3;
        else if (edge < 6 && odd) v = 3;
      }
      col[y * W + x] = v;
    }
  }

  /* ---- かわらの すじ（めんの むきに そって） ---- */
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const zone = at(x, y);
      if (zone === FRONT || zone === BACK) {
        if ((y - ridgeY + 300) % 6 === 3) set(x, y, zone === FRONT ? 2 : 3);
        const row = Math.floor((y - ridgeY + 300) / 6);
        if ((x + (row % 2 ? 8 : 0)) % 16 === 0) set(x, y, zone === FRONT ? 2 : 3);
      } else {
        if (x % 6 === 3) set(x, y, 3);
        const cl = Math.floor(x / 6);
        if ((y + (cl % 2 ? 8 : 0)) % 16 === 0) set(x, y, 3);
      }
    }
  }

  /* ---- めんの さかいめ＝すみむね（ななめの せん） ---- */
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const zone = at(x, y);
      const r = x + 1 < W ? at(x + 1, y) : zone;
      const d = y + 1 < H ? at(x, y + 1) : zone;
      if (r !== zone || d !== zone) { set(x, y, 0); set(x + 1, y, 3); set(x, y + 1, 3); }
    }
  }

  /* ---- むね（いちばん上の かわら） ---- */
  if (st !== "pyramid" && st !== "shed") {
    for (let x = g.x0; x <= g.x1 && x < W; x++) {
      for (let y = ridgeY - 3; y <= ridgeY; y++) set(x, y, 0);
      set(x, ridgeY - 4, 3);
      set(x, ridgeY + 1, 3);
    }
  }
  if (st === "pyramid") {                       // ほうぎょう：てっぺんの かざり
    const cx = Math.floor(W / 2);
    for (let y = ridgeY - 4; y <= ridgeY; y++) for (let x = cx - 2; x <= cx + 2; x++) set(x, y, 0);
    for (let x = cx - 3; x <= cx + 3; x++) set(x, ridgeY + 1, 3);
  }
  if (st === "shed") {                          // かたながれ：上に むねの かわら
    for (let x = 0; x < W; x++) { for (let y = 0; y < 4; y++) set(x, y, 0); set(x, 4, 3); }
  }
  if (st === "irimoya") {                       // いりもや：はしに ちいさな はふ（さんかくの いた）
    const hh = Math.max(4, Math.round(H * 0.22));
    for (let j = 0; j < hh; j++) {
      const wd = Math.max(1, Math.round((g.x0 - 3) * (1 - j / hh)));
      for (let i = 0; i < wd; i++) {
        const v = (i === wd - 1) ? 9 : 8;
        set(3 + i, ridgeY + 2 + j, v);
        set(W - 4 - i, ridgeY + 2 + j, v);
      }
    }
  }

  /* ---- ひさし・ふち ---- */
  for (let x = 0; x < W; x++) {
    set(x, H - 3, 2); set(x, H - 2, 3); set(x, H - 1, 3);
    set(x, 0, 3); set(x, 1, 3);
  }
  if (st === "gable" || st === "shed") {
    // きりづま・かたながれ：左右は はふいた（たての いた）
    for (let y = 0; y < H; y++) {
      set(0, y, 3); set(1, y, 0); set(2, y, 0); set(3, y, 3);
      set(W - 1, y, 3); set(W - 2, y, 0); set(W - 3, y, 0); set(W - 4, y, 3);
    }
  } else {
    for (let y = 0; y < H; y++) { set(0, y, 3); set(1, y, 3); set(W - 1, y, 3); set(W - 2, y, 3); }
  }

  paint(c, W, H, col, roof, wood);
}

// いろばんごう 0..3=やね 8,9=木（はふいた）
function paint(c, W, H, col, roof, wood) {
  for (let y = 0; y < H; y++) {
    let x = 0;
    while (x < W) {
      const v = col[y * W + x];
      let n = 1;
      while (x + n < W && col[y * W + x + n] === v) n++;
      c.fillStyle = v === 8 ? wood[1] : v === 9 ? wood[3] : roof[v];
      c.fillRect(x, y, n, 1);
      x += n;
    }
  }
}

/* --- わらぶき やね --- */
function thatchRoof(c, W, H, g, roof, wood) {
  const z = g.z, ridgeY = g.ridgeY;
  const col = new Uint8Array(W * H);
  const set = (x, y, v) => { if (x >= 0 && x < W && y >= 0 && y < H) col[y * W + x] = v; };
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const zone = z[y * W + x];
      let v = (zone === FRONT) ? 1 : 2;
      const n = (x * 7 + ((y / 5) | 0) * 13) % 11;   // わらの たての すじ
      if (n < 3) v = Math.min(3, v + 1);
      else if (n > 8) v = Math.max(0, v - 1);
      col[y * W + x] = v;
    }
  }
  for (let x = 0; x < W; x++) {                     // むね：ふとい わらの たば
    for (let y = ridgeY - 5; y <= ridgeY + 1; y++) set(x, y, 2);
    set(x, ridgeY - 6, 0);
    set(x, ridgeY + 2, 3);
    if (x % 11 < 2) for (let y = ridgeY - 5; y <= ridgeY + 1; y++) set(x, y, 3);   // しばった なわ
  }
  for (let x = 0; x < W; x++) {                     // ひさし：ふぞろいな きりくち
    const d = 2 + ((x * 5) % 3);
    for (let y = H - d; y < H; y++) set(x, y, 3);
    set(x, H - d - 1, 2);
  }
  for (let y = 0; y < H; y++) { set(0, y, 3); set(W - 1, y, 3); }
  for (let x = 0; x < W; x++) set(x, 0, 3);
  paint(c, W, H, col, roof, wood);
}

export function clearHouseCache() { cache.clear(); }
G.onPaletteChange(() => cache.clear());
