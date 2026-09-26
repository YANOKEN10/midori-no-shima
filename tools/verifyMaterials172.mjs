import assert from 'node:assert/strict';
import {MATERIAL_PROPS172,MATERIAL_ITEMS172,MATERIAL_GROUPS172} from '../src/materials172.mjs';
import {catalog,initial,validateEdit,applyEdit,objectSource} from '../src/editorModel72.mjs';
import {ITEMS} from '../src/data/items.js';
import {GOODS82} from '../src/shopCatalog82.mjs';
import {setLanguage166,t166} from '../src/i18n166.mjs';
const base={id:'test172',name:'素材テスト',kind:'out',tileWorld:true,chapter:1,rows:Array(24).fill(','.repeat(24)),props:[],npcs:[],signs:[],items:[],objects:[],warps:[],spawn:{x:1,y:1}};
const cat=catalog({test172:base},[]);assert.equal(MATERIAL_PROPS172.length,160);assert.equal(MATERIAL_ITEMS172.length,40);assert.equal(Object.keys(MATERIAL_GROUPS172).length,10);
for(const p of MATERIAL_PROPS172){const found=cat.props.find(x=>x.key===p.key);assert(found,p.key);assert.deepEqual([found.w,found.h],[p.w,p.h],p.key);
 for(const turn81 of [0,1]){const d=initial(base);d.objects.push({id:'a:test172',type:'prop',template:p.key,x:5,y:5,turn81});assert.deepEqual(validateEdit(base,d,cat),[],p.key);const m=applyEdit(base,JSON.parse(JSON.stringify(d)),cat);assert(m.editorAddedProps72.some(x=>x.art===p.key),p.key);if(p.mask&&turn81===0){assert.equal(m.rows[5][5],'#');if(p.key.includes('bridge'))assert.equal(m.rows[5][6],',');}d.objects[0].x=9;assert.deepEqual(validateEdit(base,d,cat),[],p.key+' moved');}
}
for(const d of MATERIAL_ITEMS172){assert(ITEMS[d.name]);assert(GOODS82.some(x=>x.name===d.name));const pick=cat.props.find(x=>x.pickup138===d.name);assert(pick);const doc=initial(base);doc.objects.push({id:'a:item172',type:'prop',template:pick.key,x:5,y:5,count138:2});assert.deepEqual(validateEdit(base,doc,cat),[]);const m=applyEdit(base,doc,cat);assert(m.items.some(i=>i.item===d.name&&i.count===2));setLanguage166('en');assert(!/[\u3040-\u30ff\u3400-\u9fff]/.test(t166(d.name)+t166(d.desc)));setLanguage166('ja');}
console.log('PASS 200 unique materials; 160 prop sizes/place/rotate/move and 40 pickups; item economy + English');
