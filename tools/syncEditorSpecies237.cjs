const fs = require('node:fs');
const path = require('node:path');

function sortToZukan237(species, html) {
  const order = [...html.matchAll(/<article\b[^>]*>[\s\S]*?<b[^>]*>([^<]+)<\/b>/g)].map(match => match[1]);
  const rank = new Map(order.map((name, index) => [name, index]));
  if (!order.length || rank.size !== order.length) throw Error('図鑑の並び順を読み取れませんでした。');
  const missing = species.filter(name => !rank.has(name));
  if (missing.length) throw Error('図鑑に未登録のガオン: ' + missing.join('、'));
  return [...species].sort((a, b) => rank.get(a) - rank.get(b));
}
module.exports = {sortToZukan237};

if (require.main === module) {
  const root = path.resolve(__dirname, '..');
  const file = path.join(root, 'assets/editor-v72/species.json');
  const species = JSON.parse(fs.readFileSync(file, 'utf8'));
  const sorted = sortToZukan237(species, fs.readFileSync(path.join(root, 'gaon-zukan/index.html'), 'utf8'));
  fs.writeFileSync(file, JSON.stringify(sorted));
  console.log('図鑑順に更新:', sorted.length, '種類');
}
