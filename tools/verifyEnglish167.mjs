import assert from 'node:assert/strict';
import fs from 'node:fs';
import {setLanguage166,t166} from '../src/i18n166.mjs';
import {SPECIES} from '../src/data/species.js';
import {MOVES} from '../src/data/moves.js';
import {ITEMS} from '../src/data/items.js';
import {MAPS} from '../src/data/maps.js';
import {habitatEntries,habitatRateLabel} from '../src/habitats.js';
const originals=JSON.stringify({SPECIES,MOVES,ITEMS,MAPS}),ja=/[\u3040-\u30ff\u3400-\u9fff]/;
setLanguage166('en');const missing=new Set();let checked=0;
function check(s){if(typeof s!=='string'||!s)return;checked++;if(ja.test(t166(s)))missing.add(s);setLanguage166('ja');assert.equal(t166(s),s);setLanguage166('en');}
for(const [n,d]of Object.entries(SPECIES)){check(n);check(d.dex);for(const h of habitatEntries(n)){check(h.mapName);check(habitatRateLabel(h));}}
for(const [n,d]of Object.entries({...MOVES,...ITEMS})){check(n);check(d.desc);}
for(const m of Object.values(MAPS)){check(m.name);for(const n of m.npcs||[]){check(n.name);for(const s of [...n.talk||[],...n.after||[]])check(s);}for(const s of m.signs||[])for(const x of Array.isArray(s.text)?s.text:[s.text])check(x);}
const storyFiles=['chapterStory.js','marineStory.js','powerStory.js','voyageStory.js','frontierStory.js','endgameStory.js','rivalStory122.js','npcDialogue.js'];
for(const f of storyFiles){const source=fs.readFileSync(new URL('../src/'+f,import.meta.url),'utf8');for(const m of source.matchAll(/(['"])((?:\\.|(?!\1)[^\\\r\n])*?)\1/g)){const s=m[2];if(ja.test(s)&&/[。！？」]$/.test(s)&&s.length>5&&source.slice(0,m.index).trimEnd().at(-1)!=='+')check(s);}}
for(const [s,en]of [
 ['到着まで あと123秒です。','Arrival in 123 seconds.'],
 ['生まれるまで あと250歩だよ。','The baby will be born in 250 steps.'],
 ['カニポンに 勝った！ 3／４','Crabbon defeated! 3/4'],
 ['パーク：10／10　誕生：1匹','Park: 10/10  Born: 1'],
 ['Alex Smith！ついに来たんだな！','Alex Smith! You finally made it!'],
 ['Alex Smithは リーフィンを くりだした！','Alex Smith sent out Leafin!'],
 ['Alex Smithは ラグネットを１５こ もらった！','Alex Smith received 15 Ragnets!'],
 ['25連勝中！ 第26戦','25 wins in a row! Match 26']
])assert.equal(t166(s),en);
assert.equal(JSON.stringify({SPECIES,MOVES,ITEMS,MAPS}),originals,'Canonical game data must not change');
assert.deepEqual([...missing],[],'Untranslated game content');
console.log('PASS '+checked+' game texts: all 200 Dex entries, move/item descriptions, map dialogue/signs, habitats and later story; canonical data and Japanese preserved');
