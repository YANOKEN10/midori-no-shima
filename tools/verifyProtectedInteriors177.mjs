import fs from 'node:fs';
import assert from 'node:assert/strict';
import {target173} from '../src/materialCatalog173.mjs';
import {upgrade173} from '../src/layout173.mjs';
import {upgradeLab177} from '../src/labLayout177.mjs';
import {catalog,upgrade79,applyEdit} from '../src/editorModel72.mjs';
const maps=JSON.parse(fs.readFileSync('assets/editor-v72/base-maps.json'));
const before=JSON.parse(fs.readFileSync('artifacts/maps173/published-before.json'));
const current=JSON.parse(fs.readFileSync('artifacts/lab177/published-before.json'));
const cat=catalog(maps,[]);
for(const id of ['hut','rodsHome','hospital']){
 const base=maps[id],d=current.maps[id];assert.deepEqual(d,before.maps[id]);
 assert.equal(target173(base),false);assert.equal(upgrade173(base,d,cat),d);assert.equal(upgradeLab177(base,d),d);
 const result=upgrade79(base,structuredClone(d));assert.ok(!result.layout173);assert.ok(!result.lab177);
 const rendered=applyEdit(base,result,cat);assert.ok(!rendered.layout173);assert.deepEqual(rendered.warps.map(({x,y,to})=>({x,y,to})),base.warps.map(({x,y,to})=>({x,y,to})));
 console.log(id+': saved original preserved; redesign excluded; exits preserved');
}
assert.equal(target173(maps.lab),true);
