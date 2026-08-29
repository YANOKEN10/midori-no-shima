// 枝分かれの 8エリアの 地形を つくりなおして src/data/maps.js に かきこむ
//   つかいかた: node tools/map/rebuildAreas.js
//   ※ そのあと かならず: node tools/map/checkmaps.mjs
const fs = require("fs");
const { generate } = require("./terrainGen.js");
const path = require("path");
const p = path.join(__dirname, "..", "..", "src", "data", "maps.js");
let s = fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n");
const q = (r) => '"' + r.replace(/"/g, '\\"') + '"';

let n = 0;

/* --- 枝分かれの 場所 --- */
const AREAS = {
  inlet:      { seed: 11, H: 14, theme: { water: 2, sand: 2, grass: 2, flower: 3, fence: 2 } },
  desert:     { seed: 22, H: 14, theme: { sand: 3, rock: 4, grass: 2 } },
  deepforest: { seed: 33, H: 14, theme: { grove: 6, grass: 5, flower: 4 } },
  cavern:     { seed: 44, H: 14, theme: { border: "X", floor: "C", rock: 12 } },   // ほらあなは 岩の はしら
  river:      { seed: 55, H: 14, theme: { water: 2, grass: 3, rock: 2, flower: 2, fence: 2 } },
  cloud:      { seed: 66, H: 14, theme: { rock: 4, grass: 3 } },
  volcano:    { seed: 77, H: 14, theme: { rock: 6, grass: 2, sand: 1, sandCh: "." } },
  starhill:   { seed: 88, H: 14, theme: { grass: 4, grove: 3, rock: 2, flower: 5, fence: 3 } },
};
for (const id of Object.keys(AREAS)) {
  const a = AREAS[id];
  // その 地図の かんばん・おとしもの・ひとの ばしょを よみとる
  const at = s.indexOf("MAPS." + id + " = {");
  if (at < 0) { console.log("area みつからない: " + id); continue; }
  const block = s.slice(at, s.indexOf("\n};", at));
  const sign = /signs: \[\{ x: (\d+), y: (\d+)/.exec(block);
  const item = /items: \[\{ x: (\d+), y: (\d+)/.exec(block);
  const npc = /npcs: \[\{ x: (\d+), y: (\d+)/.exec(block);
  const keep = [];
  if (sign) keep.push([+sign[1], +sign[2], "S"]);
  if (item) keep.push([+item[1], +item[2]]);
  if (npc) keep.push([+npc[1], +npc[2]]);
  const rows = generate({
    seed: a.seed, H: a.H,
    doors: [[0, 6], [1, 6]],
    keep: keep,
    theme: a.theme,
  });
  const rowsRe = new RegExp("(MAPS\\." + id + " = \\{[\\s\\S]*?)rows: \\[[\\s\\S]*?\\n  \\],");
  s = s.replace(rowsRe, "$1rows: [\n" + rows.map((r) => "    " + q(r) + ",").join("\n") + "\n  ],");
  n++;
}
fs.writeFileSync(p, s);
console.log("枝分かれの 地形を つくりなおしました: " + n + " まい");
