import {clone} from '/src/editorModel72.mjs';
import {selectRegion93,selectionBox93,transferSelection93} from '/src/bulkModel93.mjs';
export function installBulkEditor93(canvas,api){
 const toolbar=document.querySelector('.toolbar'),range=document.createElement('button'),duplicate=document.createElement('button'),clear=document.createElement('button'),label=document.createElement('label'),floor=document.createElement('input');
 range.id='rangeSelect93';range.textContent='範囲選択';duplicate.id='duplicate93';duplicate.textContent='複製して配置';clear.textContent='選択解除';floor.type='checkbox';floor.checked=true;floor.id='includeFloors93';label.append(floor,' 床も含める');toolbar.append(range,duplicate,clear,label);
 let refs=[],mode=null,gesture=null,clipboard=null,mapId=null;
 const point=e=>{const r=canvas.getBoundingClientRect();return{x:Math.floor((e.clientX-r.left)*canvas.width/r.width/32),y:Math.floor((e.clientY-r.top)*canvas.height/r.height/32)};};
 const rect=(a,b)=>({x:Math.min(a.x,b.x),y:Math.min(a.y,b.y),w:Math.abs(a.x-b.x)+1,h:Math.abs(a.y-b.y)+1});
 function reset(){refs=[];mode=null;gesture=null;range.classList.remove('active');}
 function picked(){const s=api.state();return refs.length?refs:s.selection&&['object','tile','ground'].includes(s.selection.kind)?[s.selection]:[];}
 function copy(){const s=api.state(),chosen=picked();if(!chosen.length){api.notice('先に木・家具・床を選ぶか、範囲選択で囲んでください。');return false;}clipboard={mapId:s.mapId,doc:clone(s.doc),refs:clone(chosen),box:selectionBox93(s.base,s.doc,s.cat,chosen)};return true;}
 function paste(){const s=api.state();if(!clipboard)return;if(clipboard.mapId!==s.mapId){api.notice('複製元と同じマップで配置してください。');return;}api.cancelTool();mode='paste';range.classList.remove('active');api.notice('複製を置く場所をクリックしてください。Escで取り消せます。');}
 range.onclick=()=>{api.cancelTool();refs=[];mode='range';range.classList.add('active');api.notice('左上から右下へドラッグして囲みます。選択後は枠の中をつかんで移動できます。');};
 duplicate.onclick=()=>{if(copy())paste();};clear.onclick=()=>{reset();api.cancelTool();};
 const stop=e=>{e.preventDefault();e.stopImmediatePropagation();};
 canvas.addEventListener('pointerdown',e=>{
  const s=api.state();if(s.inflight||e.button!==0)return;
  if(s.tool){reset();return;}const p=point(e);
  if(mode==='paste'){
   stop(e);try{
    // Build copies against the snapshot, then merge only newly copied entries into the current document.
    const delta={x:p.x-clipboard.box.x,y:p.y-clipboard.box.y},result=transferSelection93(s.base,clipboard.doc,s.cat,clipboard.refs,delta.x,delta.y,true),next=clone(s.doc);
    for(const r of result.refs){if(r.kind==='object')next.objects.push(result.doc.objects.find(o=>o.id===r.id));else{const[x,y]=r.id.split(',').map(Number);next.tiles=next.tiles.filter(t=>t.x!==x||t.y!==y);next.tiles.push(result.doc.tiles.find(t=>t.x===x&&t.y===y));}}
    api.commit(s.doc,next);refs=result.refs;mode=null;api.notice(refs.length+'個を複製しました。枠の中をドラッグして移動できます。');
   }catch(error){api.notice(error.message);}return;
  }
  if(mode==='range'){stop(e);canvas.setPointerCapture(e.pointerId);gesture={kind:'range',start:p,end:p};return;}
  const box=selectionBox93(s.base,s.doc,s.cat,refs);
  if(box&&p.x>=box.x&&p.y>=box.y&&p.x<box.x+box.w&&p.y<box.y+box.h){stop(e);canvas.setPointerCapture(e.pointerId);gesture={kind:'move',start:p,doc:clone(s.doc),refs:clone(refs),next:null,error:null};}else refs=[];
 },true);
 canvas.addEventListener('pointermove',e=>{
  if(!gesture)return;stop(e);const p=point(e),s=api.state();
  if(gesture.kind==='range'){gesture.end=p;return;}
  try{const result=transferSelection93(s.base,gesture.doc,s.cat,gesture.refs,p.x-gesture.start.x,p.y-gesture.start.y);gesture.next=result.doc;gesture.error=null;refs=result.refs;api.preview(result.doc);}catch(error){gesture.error=error.message;}
 },true);
 const end=e=>{if(!gesture)return;stop(e);const s=api.state(),g=gesture;gesture=null;
  if(g.kind==='range'){refs=selectRegion93(s.base,s.doc,s.cat,rect(g.start,g.end),floor.checked);mode=null;range.classList.remove('active');api.notice(refs.length?refs.length+'個を選択しました。枠の中をドラッグで移動、「複製して配置」でコピー。':'素材が選択されませんでした。別の範囲を囲んでください。');}
  else if(g.error||e.type==='pointercancel'){refs=g.refs;api.preview(g.doc);if(g.error)api.notice(g.error);}
  else if(g.next&&JSON.stringify(g.doc)!==JSON.stringify(g.next))api.commit(g.doc,g.next);
 };
 canvas.addEventListener('pointerup',end,true);canvas.addEventListener('pointercancel',end,true);
 canvas.addEventListener('keydown',e=>{
  if(e.key==='Escape'){if(gesture?.doc)api.preview(gesture.doc);reset();return;}
  if((e.ctrlKey||e.metaKey)&&['c','v','d'].includes(e.key.toLowerCase())){stop(e);if(e.key.toLowerCase()==='c')copy();else if(e.key.toLowerCase()==='d'){if(copy())paste();}else paste();return;}
  const d={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[e.key];if(d&&refs.length){stop(e);const s=api.state();try{const result=transferSelection93(s.base,s.doc,s.cat,refs,...d);api.commit(s.doc,result.doc);refs=result.refs;}catch(error){api.notice(error.message);}}
 },true);
 return {clear:reset,draw(c){const s=api.state();if(s.mapId!==mapId||s.tool){reset();mapId=s.mapId;return;}refs=refs.filter(r=>r.kind!=='object'||s.doc.objects.some(o=>o.id===r.id));const box=gesture?.kind==='range'?rect(gesture.start,gesture.end):selectionBox93(s.base,s.doc,s.cat,refs);if(!box)return;c.save();c.strokeStyle='#fff286';c.fillStyle='#fff28620';c.lineWidth=3;c.setLineDash([8,5]);c.fillRect(box.x*32,box.y*32,box.w*32,box.h*32);c.strokeRect(box.x*32+1,box.y*32+1,box.w*32-2,box.h*32-2);c.restore();}};
}
