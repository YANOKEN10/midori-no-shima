// Leave one whole floor cell between the rug edge and the entrance cell.
export function entranceRug133(map,rug){
 if(map.kind!=='in'||!Array.isArray(rug)||rug.length!==4||!rug.every(Number.isFinite)||rug[2]<=0||rug[3]<=0)return rug;
 const [x,y,w,h]=rug,exits=map.warps||[],door=exits.find(p=>p.to==='@back')||[...exits].sort((a,b)=>Math.hypot(a.x+.5-x-w/2,a.y+.5-y-h/2)-Math.hypot(b.x+.5-x-w/2,b.y+.5-y-h/2))[0];if(!door)return rug;
 const width=map.rows[0].length,height=map.rows.length,side=[['up',door.y],['down',height-1-door.y],['left',door.x],['right',width-1-door.x]].sort((a,b)=>a[1]-b[1])[0][0];
 const nx=side==='left'?door.x+2:side==='right'?door.x-1-w:x,ny=side==='up'?door.y+2:side==='down'?door.y-1-h:y;
 return [Math.max(0,Math.min(width-w,nx)),Math.max(0,Math.min(height-h,ny)),w,h];
}
export function upgradeRug133(base,d){return d.rugGap133?d:{...d,rugGap133:true,rug:entranceRug133(base,d.rug)};}
