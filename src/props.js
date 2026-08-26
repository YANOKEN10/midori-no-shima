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
      houses.push({
        x: x, y: y,
        w: x1 - x + 1, h: wy - y + 1,
        roofRows: y1 - y + 1,
        windows: windows, doors: doors,
        set: (map.sets && map.sets.r) || "roof",
      });
    }
  }
  map._houses = houses;
  return houses;
}

/* --- たてものの え --- */
export function houseImage(h) {
  const key = [h.w, h.h, h.roofRows, h.set, G.paletteName(),
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
  // ひさし（左右に 4ドット はみ出す ように 見せる）
  fill(0, 0, W, roofH, roof[1]);
  // かわらの すじ
  for (let y = 3; y < roofH; y += 6) {
    fill(0, y, W, 1, roof[2]);
    dither(0, y + 1, W, 2, roof[0], false);
  }
  for (let y = 0; y < roofH; y += 6) {
    for (let x = (y % 12 === 0 ? 5 : 13); x < W; x += 16) fill(x, y, 1, 6, roof[2]);
  }
  // むね（いちばん上）と ひさしの ふち
  fill(0, 0, W, 4, roof[0]);
  fill(0, 4, W, 1, roof[3]);
  fill(0, roofH - 5, W, 3, roof[2]);
  fill(0, roofH - 2, W, 2, roof[3]);
  // 左右の ふち
  fill(0, 0, 2, roofH, roof[3]);
  fill(W - 2, 0, 2, roofH, roof[3]);
  // やねの かげが かべに おちる
  dither(2, roofH, W - 4, 4, wall[3], false);

  cache.set(key, cv);
  return cv;
}

export function clearHouseCache() { cache.clear(); }
G.onPaletteChange(() => cache.clear());
