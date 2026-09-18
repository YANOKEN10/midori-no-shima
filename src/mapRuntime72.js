import {connectMaps75,validateLinks75} from './connections75.mjs';
import {catalog,applyEdit,validateEdit,objectSource} from './editorModel72.mjs';
let shared;
export async function loadPublishedMaps(maps){try{
 shared??=fetch('/api/map-editor',{signal:AbortSignal.timeout(7000),cache:'no-store'}).then(r=>{if(!r.ok)throw Error('maps unavailable');return r.json();});
 const [published,species]=await Promise.all([shared,fetch(new URL('../assets/editor-v72/species.json',import.meta.url),{signal:AbortSignal.timeout(7000)}).then(r=>r.json())]);const edits={...published.maps},cat=catalog(maps,species),base={...maps},moves=[];
 const previewId=new URLSearchParams(location.search).get('editorPreview72');if(previewId){try{const auth=await fetch('/api/map-editor',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+localStorage.getItem('vmon:token')},body:JSON.stringify({action:'session'}),signal:AbortSignal.timeout(7000)});if(auth.ok){const p=JSON.parse(localStorage.getItem('gaon:editorPreview72'));if(p?.map===previewId&&base[p.map]&&!validateEdit(base[p.map],p.edit,cat).length){edits[p.map]=p.edit;window.__adminPreview72=p.map;}}}catch{}}
 for(const[id,edit]of Object.entries(edits)){if(!base[id]||validateEdit(base[id],edit,cat).length)continue;maps[id]=applyEdit(base[id],edit,cat);for(let i=0;i<base[id].props.length;i++){const old=objectSource(base[id],{id:'p:'+i},cat),moved=maps[id].props.find(p=>p.editorObjectId72==='p:'+i);if(old.door&&moved?.door&&(moved.x!==old.x||moved.y!==old.y))moves.push({map:id,x:old.door.x,y:old.door.y,dx:moved.x-old.x,dy:moved.y-old.y});}}
 // Apply inbound links after every map patch, so map iteration order cannot undo them.
 for(const move of moves)for(const other of Object.values(maps))other.warps=other.warps.map(w=>w.to===move.map&&Math.abs(w.tx-move.x)<=1&&Math.abs(w.ty-move.y)<=1?{...w,tx:w.tx+move.dx,ty:w.ty+move.dy}:w);
 if(!validateLinks75(maps).length)connectMaps75(maps);
 }catch(e){console.warn('公開マップを取得できなかったため標準マップを使います。');}}
