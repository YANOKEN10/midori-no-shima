// 地図の しらべもの: node tools/map/checkmaps.mjs
//   ・よこはばが そろっているか ・ワープ／かんばん／おとしもの／人の マス
//   ・入口から ぜんぶに あるいて いけるか
import { MAPS } from "../../src/data/maps.js";
const SOLID = new Set(["T", "R", "W", "#", "r", "w", "S", "X", "=", "c", "b", "t", "K", "V", "P", "s"]);

let bad = 0;
for (const [id, m] of Object.entries(MAPS)) {
  const w = m.rows[0].length;
  m.rows.forEach((r, i) => {
    if (r.length !== w) { console.log(`WIDTH ${id} row${i} = ${r.length} (want ${w}) :: ${r}`); bad++; }
  });
  const at = (x, y) => (m.rows[y] && m.rows[y][x]) || "?";
  for (const wp of m.warps || []) {
    const c = at(wp.x, wp.y);
    if (c === "?") { console.log(`WARP OOB ${id} (${wp.x},${wp.y})`); bad++; }
    else if (SOLID.has(c) && c !== "D") { console.log(`WARP SOLID ${id} (${wp.x},${wp.y}) = '${c}'`); bad++; }
    if (wp.to && wp.to[0] !== "@") {
      const t = MAPS[wp.to];
      if (!t) { console.log(`WARP TO MISSING ${id} -> ${wp.to}`); bad++; }
      else if (wp.tx != null) {
        const tc = (t.rows[wp.ty] && t.rows[wp.ty][wp.tx]) || "?";
        if (tc === "?" || SOLID.has(tc)) { console.log(`WARP DEST BAD ${id}->${wp.to} (${wp.tx},${wp.ty}) = '${tc}'`); bad++; }
      }
    }
  }
  for (const n of m.npcs || []) {
    const c = at(n.x, n.y);
    if (c === "?" || SOLID.has(c)) { console.log(`NPC BAD ${id} ${n.name} (${n.x},${n.y}) = '${c}'`); bad++; }
  }
  for (const s of m.signs || []) {
    const c = at(s.x, s.y);
    if (c !== "S" && c !== "s") { console.log(`SIGN TILE ${id} (${s.x},${s.y}) = '${c}' (want S/s)`); bad++; }
  }
  for (const it of m.items || []) {
    const c = at(it.x, it.y);
    if (c === "?" || SOLID.has(c)) { console.log(`ITEM BAD ${id} (${it.x},${it.y}) = '${c}'`); bad++; }
  }

  /* --- あるいて とどくか（だんさは 下へ とびおりるだけ） --- */
  const H = m.rows.length;
  const key = (x, y) => x + "," + y;
  const starts = (m.warps || []).filter((p) => !SOLID.has(at(p.x, p.y)));
  if (starts.length) {
    const seen = new Set();
    const q0 = [[starts[0].x, starts[0].y]];
    seen.add(key(starts[0].x, starts[0].y));
    while (q0.length) {
      const [x, y] = q0.pop();
      const moves = [[0, -1, "up"], [0, 1, "down"], [-1, 0, "left"], [1, 0, "right"]];
      for (const [dx, dy, d] of moves) {
        let nx = x + dx, ny = y + dy;
        const c = at(nx, ny);
        if (c === "?") continue;
        if (c === "L") { if (d !== "down") continue; ny += 1; }       // とびおりるだけ
        else if (SOLID.has(c)) continue;
        if (at(nx, ny) === "?" || SOLID.has(at(nx, ny))) continue;
        if (seen.has(key(nx, ny))) continue;
        seen.add(key(nx, ny)); q0.push([nx, ny]);
      }
    }
    const check = (label, x, y) => {
      if (!seen.has(key(x, y))) { console.log(`UNREACHABLE ${id} ${label} (${x},${y})`); bad++; }
    };
    for (const wp of m.warps || []) check("warp->" + wp.to, wp.x, wp.y);
    for (const it of m.items || []) check("item " + it.item, it.x, it.y);
    // NPC は となりに 立てれば よい
    for (const n of m.npcs || []) {
      const near = [[0, -1], [0, 1], [-1, 0], [1, 0]].some(([dx, dy]) => seen.has(key(n.x + dx, n.y + dy)));
      if (!near) { console.log(`UNREACHABLE ${id} npc ${n.name} (${n.x},${n.y})`); bad++; }
    }
    for (const s of m.signs || []) {
      const near = seen.has(key(s.x, s.y + 1)) || seen.has(key(s.x, s.y - 1)) ||
                   seen.has(key(s.x - 1, s.y)) || seen.has(key(s.x + 1, s.y));
      if (!near) { console.log(`UNREACHABLE ${id} sign (${s.x},${s.y})`); bad++; }
    }
  }
  console.log(`${id.padEnd(10)} ${w}x${m.rows.length}`);
}
console.log(bad ? `\n${bad} problem(s)` : "\nmaps ok");
