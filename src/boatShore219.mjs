const shores219=new WeakMap();
const solid=new Set('TRMW#rwSX=cbtKVPLs');
export function boatShoreTarget219(map,x,y,dx,dy,boating,occupied=()=>false){
 if(!map.boatWater)return null;
 let nx=x+dx,ny=y+dy,ch=map.rows[ny]?.[nx];
 if(occupied(nx,ny))return null;
 const tiles=map.editorGround72;let shore=shores219.get(map);if(!shore||shore.tiles!==tiles){shore={tiles,cells:new Set((tiles||[]).filter(t=>t.material.startsWith('route-cliff178-')||t.material==='legacy73-cliff').map(t=>t.x+','+t.y))};shores219.set(map,shore);}
 const low=shore.cells.has(nx+','+ny)||ch==='L';
 if(low){if([...(map.props||[]),...(map.editorAddedProps72||[])].some(p=>!p.walkable&&nx>=p.x&&ny>=p.y&&nx<p.x+p.w&&ny<p.y+p.h))return null;nx+=dx;ny+=dy;ch=map.rows[ny]?.[nx];}
 if(ch===undefined||occupied(nx,ny))return null;
 if(boating?solid.has(ch):ch!=='W')return null;
 return {x:nx,y:ny};
}
