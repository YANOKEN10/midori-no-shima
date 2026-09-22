import {connectTwoCellExits140} from './mapExits140.mjs';
import {addManagedPeople120} from './managedPeople120.mjs';
import {addHomeSign117} from './homeSign117.mjs';
import {extendMaps82} from './customMaps82.mjs';
import {connectMaps75,validateLinks75} from './connections75.mjs';
import {enclosedTown114} from './townBorder114.mjs';
import {catalog,initial,applyEdit,validateEdit,objectSource} from './editorModel72.mjs';
let shared;
export async function loadPublishedMaps(maps){try{
 shared??=fetch('/api/map-editor',{signal:AbortSignal.timeout(7000),cache:'no-store'}).then(r=>{if(!r.ok)throw Error('maps unavailable');return r.json();});
 const [published,species]=await Promise.all([shared,fetch(new URL('../assets/editor-v72/species.json',import.meta.url),{signal:AbortSignal.timeout(7000)}).then(r=>r.json())]);extendMaps82(maps,published.definitions);const edits={...published.maps},cat=catalog(maps,species),base={...maps},moves=[];
 const previewId=new URLSearchParams(location.search).get('editorPreview72');if(previewId){try{const auth=await fetch('/api/map-editor',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+localStorage.getItem('vmon:token')},body:JSON.stringify({action:'session'}),signal:AbortSignal.timeout(7000)});if(auth.ok){const p=JSON.parse(localStorage.getItem('gaon:editorPreview72'));if(p?.definition){extendMaps82(base,{[p.definition.id]:p.definition});extendMaps82(maps,{[p.definition.id]:p.definition});cat.maps=base;}if(p?.map===previewId&&base[p.map]&&!validateEdit(base[p.map],p.edit,cat).length){edits[p.map]=p.edit;window.__adminPreview72=p.map;}}}catch{}}
 // Saved edits may use the bundled editor layout (for example the original shop).
 // Validate against that exact trusted base, retaining all normal fingerprint checks.
 if(base.shop||base.hospital||Object.entries(edits).some(([id,d])=>base[id]&&validateEdit(base[id],d,cat).length)){
  const raw=await fetch(new URL('../assets/editor-v72/base-maps.json',import.meta.url),{signal:AbortSignal.timeout(7000)}).then(r=>r.json());
  const editorBases=extendMaps82(addManagedPeople120(raw),published.definitions),editorCat=catalog(editorBases,species);
  for(const id of ['hospital','shop','building83-marineShop'])if(editorBases[id]){base[id]=editorBases[id];maps[id]=editorBases[id];}
  for(const[id,d]of Object.entries(edits))if(base[id]&&validateEdit(base[id],d,cat).length&&editorBases[id]&&!validateEdit(editorBases[id],d,editorCat).length){base[id]=editorBases[id];maps[id]=editorBases[id];}
 }
 for(const[id,m]of Object.entries(base))if((enclosedTown114(m)||m.id==='mountain'&&m.forestBorder||m.kind==='in'&&m.room?.rug)&&!edits[id])edits[id]=initial(m);
 for(const[id,edit]of Object.entries(edits)){if(!base[id]||validateEdit(base[id],edit,cat).length)continue;maps[id]=applyEdit(base[id],edit,cat);for(let i=0;i<base[id].props.length;i++){const old=objectSource(base[id],{id:'p:'+i},cat),moved=maps[id].props.find(p=>p.editorObjectId72==='p:'+i);if(old.door&&moved?.door&&(moved.x!==old.x||moved.y!==old.y||moved.turn81))moves.push({map:id,x:old.door.x,y:old.door.y,nx:moved.door.x,ny:moved.door.y,turn:moved.turn81||0});}}
 // Apply inbound links after every map patch, so map iteration order cannot undo them.
 for(const other of Object.values(maps))other.warps=other.warps.map(w=>{const move=moves.find(m=>w.to===m.map&&Math.abs(w.tx-m.x)<=1&&Math.abs(w.ty-m.y)<=1);if(!move)return w;const dx=w.tx-move.x,dy=w.ty-move.y,[rx,ry]=move.turn===1?[-dy,dx]:move.turn===2?[-dx,-dy]:move.turn===3?[dy,-dx]:[dx,dy];return {...w,tx:move.nx+rx,ty:move.ny+ry};});
 if(!validateLinks75(maps).length)connectMaps75(maps);
 }catch(e){const cat=catalog(maps,[]);for(const[id,m]of Object.entries(maps))if((enclosedTown114(m)||m.id==='mountain'&&m.forestBorder||m.kind==='in'&&m.room?.rug)&&!m.editor72)maps[id]=applyEdit(m,initial(m),cat);console.warn('公開マップを取得できなかったため標準マップを使います。');}addHomeSign117(maps.village);connectTwoCellExits140(maps);}
