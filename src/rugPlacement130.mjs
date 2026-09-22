// Move existing indoor rugs one tile toward the entrance, once per layout.
export function entranceRug130(map,rug){
 if(map.kind!=='in'||!Array.isArray(rug)||rug.length!==4||!rug.every(Number.isFinite)||rug[2]<=0||rug[3]<=0)return rug;
 const [x,y,w,h]=rug,cx=x+w/2,cy=y+h/2;
 const exits=map.warps||[],door=exits.find(p=>p.to==='@back')||[...exits].sort((a,b)=>Math.hypot(a.x+.5-cx,a.y+.5-cy)-Math.hypot(b.x+.5-cx,b.y+.5-cy))[0];
 const dx=door?door.x+.5-cx:0,dy=door?door.y+.5-cy:1;
 const nx=x+(Math.abs(dx)>Math.abs(dy)?Math.sign(dx):0),ny=y+(Math.abs(dx)>Math.abs(dy)?0:Math.sign(dy)||1);
 return [Math.max(0,Math.min(map.rows[0].length-w,nx)),Math.max(0,Math.min(map.rows.length-h,ny)),w,h];
}
export function moveRugs130(maps){for(const m of Object.values(maps))if(m.room&&!m.room.rugEntrance130)m.room={...m.room,rugOriginal130:m.room.rug,rug:entranceRug130(m,m.room.rug),rugEntrance130:true};return maps;}
export function upgradeRug130(base,d){if(d.rugEntrance130)return d;return {...d,rugEntrance130:true,rug:entranceRug130(base,d.rug)};}
