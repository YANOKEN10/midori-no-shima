// Cache immutable published map projections until their source document changes.
export function createPublishedCache181(validate,apply){let lastMaps,lastCat,cache=new Map();return(maps,docs,cat)=>{if(maps!==lastMaps||cat!==lastCat){cache.clear();lastMaps=maps;lastCat=cat;}const views={...maps};for(const[id,doc]of Object.entries(docs)){if(!maps[id])continue;let row=cache.get(id);if(!row||row.doc!==doc){row={doc,map:validate(maps[id],doc,cat).length?maps[id]:apply(maps[id],doc,cat)};cache.set(id,row);}views[id]=row.map;}return views;};}
// Connections change these arrays/records only; immutable geometry and art are shared.
export function connectionCopies181(views){return Object.fromEntries(Object.entries(views).map(([id,m])=>[id,{...m,warps:(m.warps||[]).map(w=>({...w})),editorLinks75:structuredClone(m.editorLinks75||[])}]));}
// Schedule only while work is pending; idle tabs do not retain an RAF loop.
export function createDrawScheduler181(paint){let frame=0,requested=false,last=-Infinity,until=0;
function request(){if(!frame&&!document.hidden)frame=requestAnimationFrame(tick);}
function invalidate(settle=0){requested=true;until=Math.max(until,performance.now()+settle);request();}
function tick(t){frame=0;if(document.hidden)return;if(t-last<33){request();return;}if(!requested&&t>until)return;requested=false;last=t;paint();if(requested||t<until)request();}
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else invalidate(300);});invalidate();return{invalidate};}
