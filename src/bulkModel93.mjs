import {visiblePlacement97} from './editorModel72.mjs';
import {clone,objectSource,FLOORS} from './editorModel72.mjs';
import {GROUND88} from './groundCatalog88.mjs';
const cell=(x,y)=>x+','+y;
export function nativeFloor93(base,x,y){
 const ch=base.rows[y]?.[x];if(!ch)return null;
 const same=(a,b)=>base.rows[b]?.[a]===ch;
 const mask=[[0,-1],[1,0],[0,1],[-1,0]].reduce((m,[dx,dy],i)=>m+(same(x+dx,y+dy)?1<<i:0),0);
 const corners=mask===15?[[-1,-1],[1,-1],[1,1],[-1,1]].reduce((m,[dx,dy],i)=>m+(same(x+dx,y+dy)?0:1<<i),0):0;
 return GROUND88.find(p=>p.source===base.id&&p.tile===ch&&p.mask88===mask&&p.corners88===corners)?.key||FLOORS.find(f=>f[0]==='legacy73-ground-'+base.id+'-'+ch.charCodeAt(0))?.[0]||({',':'grass','.':'path',f:'wood','"':'tallGrass',W:'river',X:'wall'})[ch]||null;
}
export function selectionBox93(base,doc,cat,refs){
 const rects=refs.map(r=>{if(r.kind==='object'){const o=doc.objects.find(o=>o.id===r.id);return o?{x:o.x,y:o.y,...Object.fromEntries(['w','h'].map(k=>[k,objectSource(base,o,cat)[k]]))}:null;}const[x,y]=r.id.split(',').map(Number);return{x,y,w:1,h:1};}).filter(Boolean);
 if(!rects.length)return null;const x=Math.min(...rects.map(r=>r.x)),y=Math.min(...rects.map(r=>r.y));return{x,y,w:Math.max(...rects.map(r=>r.x+r.w))-x,h:Math.max(...rects.map(r=>r.y+r.h))-y};
}
export function selectRegion93(base,doc,cat,rect,includeFloor){
 const inside=(x,y)=>x>=rect.x&&y>=rect.y&&x<rect.x+rect.w&&y<rect.y+rect.h;
 const objects=doc.objects.filter(o=>!o.stored79&&inside(o.x,o.y)),refs=objects.map(o=>({kind:'object',id:o.id}));
 const blocked=(x,y)=>doc.objects.some(o=>{if(o.stored79)return false;const p=objectSource(base,o,cat);return x>=o.x&&y>=o.y&&x<o.x+p.w&&y<o.y+p.h;})||[...base.warps,...base.signs,...base.items||[]].some(p=>p.x===x&&p.y===y);
 for(let y=Math.max(0,rect.y);y<Math.min(base.rows.length,rect.y+rect.h);y++)for(let x=Math.max(0,rect.x);x<Math.min(base.rows[0].length,rect.x+rect.w);x++){
  if(blocked(x,y))continue;const t=doc.tiles.find(t=>t.x===x&&t.y===y);
  if(t||includeFloor&&nativeFloor93(base,x,y))refs.push({kind:t?'tile':'ground',id:cell(x,y)});
 }
 return refs;
}
export function transferSelection93(base,doc,cat,refs,dx,dy,copy=false,newId=()=> 'a:'+crypto.randomUUID()){
 const next=clone(doc),out=[],box=selectionBox93(base,doc,cat,refs);if(!box)return{doc:next,refs:[]};
 for(const ref of refs){if(ref.kind==='object'){const o=doc.objects.find(o=>o.id===ref.id);if(o&&!visiblePlacement97(base,{...o,x:o.x+dx,y:o.y+dy},objectSource(base,o,cat)))throw Error('素材の一部がマップ内に見える位置へ動かしてください。');}else{const[x,y]=ref.id.split(',').map(Number);if(x+dx<0||y+dy<0||x+dx>=base.rows[0].length||y+dy>=base.rows.length)throw Error('床のマスはマップ内に置いてください。');}}
 const movingTiles=refs.filter(r=>r.kind!=='object').map(r=>{const[x,y]=r.id.split(',').map(Number),t=doc.tiles.find(t=>t.x===x&&t.y===y);const material=t?.material||nativeFloor93(base,x,y);if(!material)throw Error('この地面はまだ複製できません。');return{x,y,material,turn81:t?.turn81||0};});
 const put=t=>{next.tiles=next.tiles.filter(p=>p.x!==t.x||p.y!==t.y);next.tiles.push(t);};
 if(!copy)for(const t of movingTiles)put({x:t.x,y:t.y,material:base.kind==='in'?'wood':'grass',turn81:0});
 for(const t of movingTiles){const moved={...t,x:t.x+dx,y:t.y+dy};put(moved);out.push({kind:'tile',id:cell(moved.x,moved.y)});}
 for(const ref of refs.filter(r=>r.kind==='object')){
  const source=doc.objects.find(o=>o.id===ref.id);if(!source)continue;let target=next.objects.find(o=>o.id===ref.id);
  if(copy){target={...clone(source),id:newId()};if(!source.id.startsWith('a:'))target.copyOf93=source.id;next.objects.push(target);}
  target.x+=dx;target.y+=dy;out.push({kind:'object',id:target.id});
 }
 return {doc:next,refs:out};
}
