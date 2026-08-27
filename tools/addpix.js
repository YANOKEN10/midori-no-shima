// 絵から おこした ドットえを monpix.js に くわえる（かいはつ用）
//   つかいかた: node tools/addpix.js <json> "ガオンの なまえ"
//   json は { pal: [...], rows: [...] }（pixelize.js の かえりち）
const fs = require("fs");
const [, , jsonPath, name] = process.argv;
if (!jsonPath || !name) { console.error("node tools/addpix.js <json> <なまえ>"); process.exit(1); }
const art = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const p = "src/data/monpix.js";
let s = fs.readFileSync(p, "utf8");
const block = `  "${name}": {\n    pal: ${JSON.stringify(art.pal)},\n    rows: [\n` +
  art.rows.map((r) => `      "${r}",`).join("\n") + `\n    ],\n  },\n\n`;
// おなじ なまえが あれば さしかえ
const re = new RegExp('  "' + name + '": \{[\s\S]*?\n  \},\n\n?', "");
s = re.test(s) ? s.replace(re, block) : s.replace("export const PIX = {\n", "export const PIX = {\n" + block);
fs.writeFileSync(p, s);
console.log(name + " を いれました（" + art.pal.length + "色）");
