const styles=[['village','ネイチャータウン',5,4],['rods','ロッズタウン',7,4]];
export const PONDS87=styles.map(([id,name,w,h])=>({key:'pond87-'+id,art:'pond87-'+id,label:name+'・池（全体）',w,h,tile:'W',pond87:true,source:id,group:'pond'}));
export const POND_TILES87=styles.flatMap(([id,name,w,h])=>[['tl','左上の角',0,0],['top','上ふち',1,0],['tr','右上の角',w-1,0],['left','左ふち',0,1],['center','水面',1,1],['right','右ふち',w-1,1],['bl','左下の角',0,h-1],['bottom','下ふち',1,h-1],['br','右下の角',w-1,h-1]].map(([part,label,sx,sy])=>({key:'pond87-'+id+'-'+part,label:name+'・池の'+label,sw:w,sh:h,sx,sy})));
export function pondObject87(map){if(!map.townPond)return null;const[x,y,w,h]=map.townPond;return {id:'g:'+(y*map.rows[0].length+x),type:'prop',template:'pond87-'+(map.id==='village'?'village':'rods'),x,y,w,h,pond87:true};}
export function upgradePond87(base,d){
 if(d.ponds87)return d;
 const p=pondObject87(base),next={...d,ponds87:true};
 if(!p||d.objects.some(o=>o.id===p.id))return next;
 const edited=d.tiles.some(t=>t.x>=p.x&&t.x<p.x+p.w&&t.y>=p.y&&t.y<p.y+p.h);
 if(!edited)return {...next,objects:[...d.objects,p]};
 // Preserve the remaining pond cells when migrating a draft that already painted over part of it.
 const cells=new Set(d.tiles.map(t=>t.x+','+t.y)),tiles=[...d.tiles];
 for(let y=0;y<p.h;y++)for(let x=0;x<p.w;x++){
  if(cells.has((p.x+x)+','+(p.y+y)))continue;
  const part=y===0?(x===0?'tl':x===p.w-1?'tr':'top'):y===p.h-1?(x===0?'bl':x===p.w-1?'br':'bottom'):x===0?'left':x===p.w-1?'right':'center';
  tiles.push({x:p.x+x,y:p.y+y,material:p.template+'-'+part});
 }
 return {...next,tiles};
}
