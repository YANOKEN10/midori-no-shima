// Resolve the current exterior door, not the coordinates stored before a map edit.
export function recoveryPoint126(maps,saved){
 const doors=[];
 for(const [map,m] of Object.entries(maps))for(const w of m.warps||[]){
  if(!w.back)continue;
  const room=maps[w.to];
  if(w.to!=='hospital'&&!room?.npcs?.some(n=>n.healAll&&!n.restStop))continue;
  doors.push({map,w});
 }
 const local=doors.filter(d=>d.map===saved?.map);
 const byDistance=(a,b)=>Math.hypot(a.w.back.x-(saved?.x||0),a.w.back.y-(saved?.y||0))-Math.hypot(b.w.back.x-(saved?.x||0),b.w.back.y-(saved?.y||0));
 const chosen=local.find(d=>saved?.editorDoorId72&&d.w.back.editorDoorId72===saved.editorDoorId72)
   ||local.filter(d=>!saved?.interior126||d.w.to===saved.interior126).sort(byDistance)[0]
   ||local.sort(byDistance)[0]||doors.find(d=>d.map==='village')||doors[0];
 if(chosen){const {map,w}=chosen,b=w.back,dx=b.x-w.x,dy=b.y-w.y;return {map,x:b.x,y:b.y,dir:Math.abs(dx)>Math.abs(dy)?(dx<0?'left':'right'):(dy<0?'up':'down')};}
 // A custom world without a hospital can still return to the current home entrance.
 const home=maps.village?.warps?.find(w=>w.to==='hut'&&w.back);
 if(home)return {...home.back,dir:'down'};
 const map=maps[saved?.map]?saved.map:maps.village?'village':Object.keys(maps)[0];
 return {map,...(maps[map]?.spawn||{x:5,y:11}),dir:'down'};
}
