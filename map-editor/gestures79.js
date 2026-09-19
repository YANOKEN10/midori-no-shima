// Two-finger gestures restore the first touch's tentative edit before zooming.
export function installGestures79(view,canvas,api){
 // Keep the map point under the cursor fixed; wheel affects only this viewport.
 (api.wheelSurface||view).addEventListener('wheel',e=>{
  if(!e.deltaY||view.closest('[inert]'))return;
  e.preventDefault();e.stopPropagation();
  const old=api.getZoom(),r=canvas.getBoundingClientRect();
  const mx=(e.clientX-r.left)/old,my=(e.clientY-r.top)/old;
  const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?view.clientHeight:1);
  const z=Math.max(.1,Math.min(4,old*Math.exp(-Math.max(-240,Math.min(240,delta))*.002)));
  api.setZoom(z);
  const next=canvas.getBoundingClientRect();
  view.scrollLeft+=next.left+mx*z-e.clientX;
  view.scrollTop+=next.top+my*z-e.clientY;
 },{passive:false,capture:true});
 const points=new Map();let saved=null,pinch=null,blocked=false;
 const center=()=>{const [a,b]=[...points.values()];return {x:(a.x+b.x)/2,y:(a.y+b.y)/2,d:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y))};};
 view.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch')return;points.set(e.pointerId,{x:e.clientX,y:e.clientY});if(points.size===1){saved=api.snapshot();blocked=false;}if(points.size>=2){e.preventDefault();e.stopImmediatePropagation();if(!pinch){api.restore(saved);api.cancel();const c=center(),r=canvas.getBoundingClientRect();pinch={...c,z:api.getZoom(),mx:(c.x-r.left)/api.getZoom(),my:(c.y-r.top)/api.getZoom()};}blocked=true;view.setPointerCapture(e.pointerId);}},true);
 view.addEventListener('pointermove',e=>{if(!points.has(e.pointerId))return;points.set(e.pointerId,{x:e.clientX,y:e.clientY});if(!blocked)return;e.preventDefault();e.stopImmediatePropagation();if(points.size<2||!pinch)return;const c=center(),z=Math.max(.1,Math.min(4,pinch.z*c.d/pinch.d));api.setZoom(z);const r=canvas.getBoundingClientRect();view.scrollLeft+=r.left+pinch.mx*z-c.x;view.scrollTop+=r.top+pinch.my*z-c.y;},true);
 const end=e=>{if(!points.has(e.pointerId))return;points.delete(e.pointerId);if(blocked){e.preventDefault();e.stopImmediatePropagation();api.cancel();}if(!points.size){saved=null;pinch=null;blocked=false;}};
 view.addEventListener('pointerup',end,true);view.addEventListener('pointercancel',end,true);
}
