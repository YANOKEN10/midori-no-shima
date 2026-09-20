import {extendMaps82} from './customMaps82.mjs';
import {connectMaps75,validateLinks75} from './connections75.mjs';
import {catalog,applyEdit,validateEdit,objectSource} from './editorModel72.mjs';
let shared;
export async function loadPublishedMaps(maps){try{
 shared??=fetch('/api/map-editor',{signal:AbortSignal.timeout(7000),cache:'no-store'}).then(r=>{if(!r.ok)throw Error('maps unavailable');return r.json();});
 const [published,species]=await Promise.all([shared,fetch(new URL('../assets/editor-v72/species.json',import.meta.url),{signal:AbortSignal.timeout(7000)}).then(r=>r.json())]);extendMaps82(maps,published.definitions);const edits={...published.maps},cat=catalog(maps,species),base={...maps},moves=[];
 const previewId=new URLSearchParams(location.search).get('editorPreview72');if(previewId){try{const auth=await fetch('/api/map-editor',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+localStorage.getItem('vmon:token')},body:JSON.stringify({action:'session'}),signal:AbortSignal.timeout(7000)});if(auth.ok){const p=JSON.parse(localStorage.getItem('gaon:editorPreview72'));if(p?.definition){extendMaps82(base,{[p.definition.id]:p.definition});extendMaps82(maps,{[p.definition.id]:p.definition});cat.maps=base;}if(p?.map===previewId&&base[p.map]&&!validateEdit(base[p.map],p.edit,cat).length){edits[p.map]=p.edit;window.__adminPreview72=p.map;}}}catch{}}
 for(const[id,edit]of Object.entries(edits)){if(!base[id]||validateEdit(base[id],edit,cat).length)continue;maps[id]=applyEdit(base[id],edit,cat);for(let i=0;i<base[id].props.length;i++){const old=objectSource(base[id],{id:'p:'+i},cat),moved=maps[id].props.find(p=>p.editorObjectId72==='p:'+i);if(old.door&&moved?.door&&(moved.x!==old.x||moved.y!==old.y||moved.turn81))moves.push({map:id,x:old.door.x,y:old.door.y,nx:moved.door.x,ny:moved.door.y,turn:moved.turn81||0});}}
 // Apply inbound links after every map patch, so map iteration order cannot undo them.
 for(const other of Object.values(maps))other.warps=other.warps.map(w=>{const move=moves.find(m=>w.to===m.map&&Math.abs(w.tx-m.x)<=1&&Math.abs(w.ty-m.y)<=1);if(!move)return w;const dx=w.tx-move.x,dy=w.ty-move.y,[rx,ry]=move.turn===1?[-dy,dx]:move.turn===2?[-dx,-dy]:move.turn===3?[dy,-dx]:[dx,dy];return {...w,tx:move.nx+rx,ty:move.ny+ry};});
 if(!validateLinks75(maps).length)connectMaps75(maps);
 }catch(e){console.warn('公開マップを取得できなかったため標準マップを使います。');}}
