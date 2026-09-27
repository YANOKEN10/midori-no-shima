import fs from 'node:fs';
import assert from 'node:assert/strict';
import {catalog,initial,objectSource,applyEdit,validateEdit,pass} from '../src/editorModel72.mjs';
const maps=JSON.parse(fs.readFileSync('assets/editor-v72/base-maps.json'));
const cat=catalog(maps,JSON.parse(fs.readFileSync('assets/editor-v72/species.json')));
for(const key of ['eIce','legacy73-eIce','ice-crystal-small186']){
 const p=cat.props.find(p=>p.key===key);assert(p,key);
 assert.deepEqual([p.w,p.h],key==='ice-crystal-small186'?[1,1]:[2,2]);
}
const base={...structuredClone(maps.route1),id:'ice-test186',kind:'cave',rows:Array.from({length:12},(_,y)=>y===0||y===11?'XXXXXXXXXXXX':'X..........X'),props:[{art:'eIce',x:3,y:3,w:2,h:4}],npcs:[],warps:[],items:[],signs:[],spawn:{x:1,y:1}};
for(let y=3;y<7;y++)base.rows[y]=base.rows[y].slice(0,3)+'RR'+base.rows[y].slice(5);
cat.maps[base.id]=base;
const doc=initial(base);doc.objects.push({id:'a:ice186',type:'prop',template:'ice-crystal-small186',x:8,y:3});
const snapshot=JSON.stringify(doc),source=objectSource(base,{id:'p:0'},cat);assert.deepEqual([source.w,source.h],[2,2]);
const result=applyEdit(base,JSON.parse(snapshot),cat);
assert.deepEqual(validateEdit(base,doc,cat),[]);
assert.equal(JSON.stringify(doc),snapshot);
assert(result.props.some(p=>p.art==='eIce'&&p.w===2&&p.h===2));
assert(result.editorAddedProps72.some(p=>p.art==='ice-crystal-small186'&&p.w===1&&p.h===1));
for(const [x,y] of [[3,3],[4,4],[8,3]])assert(!pass(result,x,y),'crystal collision '+x+','+y);
for(const [x,y] of [[3,5],[4,6],[8,4],[9,3]])assert(pass(result,x,y),'released footprint '+x+','+y);
console.log('PASS ice 2x2 + 1x1 catalog, saved placement, runtime and released old collision');
