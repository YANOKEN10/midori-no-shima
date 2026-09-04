const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const world = fs.readFileSync('src/world.js', 'utf8');
const tileBody = world.match(/export function tileAt\(map, x, y\) \{([\s\S]*?)\n\}/)[1];
const tileAt = new Function('map', 'x', 'y', tileBody);
const map = { rows: ['XX..', 'X...'] };
assert.equal(tileAt(map, 2.41, 1.82), '.');
assert.equal(tileAt(map, NaN, 1), null);
assert.equal(tileAt(map, 2, Infinity), null);
assert.equal(tileAt(map, -0.1, 1), null);
assert.equal(tileAt(map, 4, 1), null);
const created = [], errors = [];
let now = 100;
class MockImage { constructor() { this.complete = false; this.naturalWidth = 0; created.push(this); } }
const art = fs.readFileSync('src/revampArt.js', 'utf8').replaceAll('import.meta.url', JSON.stringify('https://example.test/src/revampArt.js')).replaceAll('export function ', 'function ');
const context = vm.createContext({ Image: MockImage, URL, Date: { now: () => now }, console: { error: (...args) => errors.push(args) } });
vm.runInContext(art, context);
assert.equal(created.length, 3, 'No map backgrounds should download at startup');
const ctx = { drawImage() { this.drawn = true; } };
context.ctx = ctx;
assert.equal(vm.runInContext('drawWorldBackdrop(ctx, "kazenari-valley", 0, 0, 1408, 1120)', context), false);
assert.equal(created.length, 4, 'Only the current map should download');
created[3].onerror(); now += 3100;
vm.runInContext('drawWorldBackdrop(ctx, "kazenari-valley", 0, 0, 1408, 1120)', context);
assert.equal(created.length, 5);
assert.match(created[4].src, /retry=2/);
created[4].complete = true; created[4].naturalWidth = 1408;
assert.equal(vm.runInContext('drawWorldBackdrop(ctx, "kazenari-valley", 0, 0, 1408, 1120)', context), true);
assert.equal(ctx.drawn, true);
assert.equal(errors.length, 1);
context.matte = new Uint8ClampedArray(5 * 5 * 4);
for (let i=0;i<context.matte.length;i+=4) context.matte[i+3]=255;
// 白い輪の中の黒い眼は残し、外周の黒だけを除去する。
for (let y=1;y<=3;y++) for(let x=1;x<=3;x++) {
  if(x===2 && y===2) continue;
  const p=(y*5+x)*4; context.matte[p]=context.matte[p+1]=context.matte[p+2]=200;
}
vm.runInContext('clearBorderMatte(matte, 5, 5)', context);
assert.equal(context.matte[3],0);
assert.equal(context.matte[(2*5+2)*4+3],255);
console.log(JSON.stringify({ fractionalSaveLookup: 'pass', invalidCoordinates: 'pass', lazyMapLoad: 'pass', failedImageRetry: 'pass', recoveredBackdropDraw: 'pass' }));
