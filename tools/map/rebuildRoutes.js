// みち（route1〜7）の 地形を つくりなおして src/data/maps.js に かきこむ
//   つかいかた: node tools/map/rebuildRoutes.js
//   ※ そのあと かならず: node tools/map/checkmaps.mjs
const fs = require("fs");
const { generate } = require("./terrainGen.js");
const path = require("path");
const P = path.join(__dirname, "..", "..", "src", "data", "maps.js");
const KEEP = {
  route1: [[8, 4], [4, 9]], route2: [[11, 5]], route3: [[8, 4], [4, 12]], route4: [[11, 9]],
  route5: [[4, 5]], route6: [[8, 4], [11, 12]], route7: [[4, 3]],
};
const THEME = {
  route1: { water: 1, grass: 3, rock: 1, sand: 1, flower: 4, fence: 2 },
  route2: { sand: 2, rock: 3, grass: 2, sandCh: "~" },
  route3: { grove: 4, grass: 4, flower: 5, fence: 2 },
  route4: { rock: 5, grass: 2, sand: 1, sandCh: "." },
  route5: { water: 2, grass: 3, flower: 3, fence: 2 },
  route6: { rock: 3, grass: 3, grove: 2 },
  route7: { rock: 4, grass: 3, sand: 1, sandCh: "." },
};
const q = (r) => '"' + r.replace(/"/g, '\\"') + '"';
let s = fs.readFileSync(P, "utf8").replace(/\r\n/g, "\n");
let n = 0;
for (const id of Object.keys(KEEP)) {
  const head = '{ id: "' + id + '"';
  const a = s.indexOf(head);
  if (a < 0) { console.log("ない: " + id); continue; }
  const nextDef = s.indexOf('{ id: "', a + head.length);
  const end = nextDef < 0 ? s.length : nextDef;
  let blk = s.slice(a, end);
  // この def の 中の rows: [ ... ], を ぜんぶ とりのぞく
  for (;;) {
    const rs = blk.indexOf("    rows: [");
    if (rs < 0) break;
    const re2 = blk.indexOf("\n    ],\n", rs);
    if (re2 < 0) break;
    blk = blk.slice(0, rs) + blk.slice(re2 + "\n    ],\n".length);
  }
  const keep = KEEP[id].map((c) => [c[0], c[1]]);
  keep.push([3, 10, "S"]);
  const rows = generate({ seed: 100 + n * 37, H: 16, doors: [[6, 15], [7, 15], [6, 0], [7, 0]], keep, theme: THEME[id] });
  const nl = blk.indexOf("\n") + 1;   // def の 1ぎょうめの あと
  blk = blk.slice(0, nl) + "    rows: [\n" + rows.map((r) => "      " + q(r) + ",").join("\n") + "\n    ],\n" + blk.slice(nl);
  s = s.slice(0, a) + blk + s.slice(end);
  n++;
}
fs.writeFileSync(P, s);
console.log("みちを 入れなおしました: " + n);
