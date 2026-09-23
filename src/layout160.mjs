import {twoCellExits140} from './mapExits140.mjs';
export const maps160=id=>['momi','shipCabins','manikereo','manikereoStation','shipLounge'].includes(id);
export function upgradeLayout160(base,d,source,cat){
 if(d.layout160||!maps160(base.id))return d;
 const tiles=new Map(d.tiles.map(t=>[t.x+','+t.y,t]));
 const paint=(x,y,material)=>tiles.set(x+','+y,{x,y,material});
 let objects=d.objects.map(o=>({...o})),actors=d.actors;
 if(base.id==='shipCabins'){
  // Four rooms share a three-cell corridor, each with its own two-cell doorway.
  for(let y=1;y<23;y++)for(let x=1;x<31;x++)if(base.rows[y][x]==='X')paint(x,y,'wood');
  for(const y of [9,13])for(let x=1;x<31;x++)paint(x,y,[8,9,23,24].includes(x)?'wood':'wall');
  for(let y=1;y<23;y++)if(y<10||y>12)paint(15,y,'wall');
  for(let y=10;y<=12;y++)for(let x=1;x<31;x++)paint(x,y,'wood');
  actors=actors.map(a=>a.id==='n:1'&&a.x===25&&a.y===10?{...a,x:27,y:6}:a);
 }
 if(base.id==='shipCabins'||base.id==='shipLounge')objects=objects.flatMap(o=>{
  const p=source(base,o,cat);if(o.stored79||p?.kind!=='ship-table85'&&o.template!=='ship-table85')return [o];
  // Retain position and editing identity; use the full-size table artwork.
  return [{...o,stored79:true},{...o,id:'a:table160-'+o.id.replace(':','-'),template:'table-square-oak128'}];
 });
 if(base.id==='manikereo')for(let y=11;y<=23;y++)for(let x=18;x<=24;x++)if(base.rows[y]?.[x]==='.'||x===20||x===21)paint(x,y,[20,21].includes(x)?'cobble':'herringbone152');
 if(base.id==='manikereo')objects=objects.map(o=>[20,21].includes(o.x)&&o.y>=11&&o.y<=23&&/flower|fence/i.test(o.template)?{...o,stored79:true}:o);
 if(base.id==='momi'){
  const m=twoCellExits140(structuredClone(base)),w=base.rows[0].length,h=base.rows.length,cells=[];
  for(const p of m.warps){const dx=p.x===0?1:p.x===w-1?-1:0,dy=p.y===0?1:p.y===h-1?-1:0;if(!dx&&!dy)continue;for(let n=0;n<5;n++)cells.push({x:p.x+dx*n,y:p.y+dy*n});}
  const inside=(p,t)=>t.x>=p.x&&t.x<p.x+p.w&&t.y>=p.y&&t.y<p.y+p.h;
  objects=objects.map(o=>{const p=source(base,o,cat);return p&&(/tree|fir|rock/i.test(p.art||o.template)||p.tile==='T'||p.tile==='R')&&(cells.some(t=>inside({...p,x:o.x,y:o.y},t))||o.x===0||o.y===0||o.x+p.w>=w||o.y+p.h>=h)?{...o,stored79:true}:o;});
  for(const t of cells)paint(t.x,t.y,'snow');
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(x===0||y===0||x===w-1||y===h-1){paint(x,y,'snow');if(!cells.some(t=>t.x===x&&t.y===y))objects.push({id:`a:snow-border160-${x}-${y}`,type:'prop',template:'snow-border160',x,y});}
 }
 return {...d,layout160:true,objects,actors,tiles:[...tiles.values()]};
}
export function applyLayout160(map){
 if(!map)return map;
 if(map.id==='momi')for(const key of ['rows','editorVisualRows73'])if(map[key]){const g=map[key].map(r=>[...r]);for(const p of map.editorObjects78||[])if(p.key==='snow-border160'&&!map.warps.some(w=>w.x===p.x&&w.y===p.y))g[p.y][p.x]='R';map[key]=g.map(r=>r.join(''));}
 if(map.id==='shipCabins'){map.cabinDoors160=[[8,9],[23,9],[8,13],[23,13]];map.editorGround72=(map.editorGround72||[]).filter(t=>!['wood','wall'].includes(t.material));}
 if(map.id==='momi')map.editorGround72=(map.editorGround72||[]).filter(t=>t.material!=='snow');
 if(map.id!=='manikereo')return map;
 const p=[...(map.props||[]),...(map.editorAddedProps72||[])].find(p=>p.art==='station');
 const old=map.warps.find(w=>w.to==='manikereoStation'&&!w.editorLink75);if(!p||!old)return map;
 const x=p.x+Math.floor(p.w/2)-1,y=p.y+p.h-1;
 map.warps=map.warps.filter(w=>w.to!=='manikereoStation'||w.editorLink75);
 for(let i=0;i<2;i++)map.warps.push({...old,x:x+i,y,tx:16+i,ty:21,station160:true});
 for(const key of ['rows','editorVisualRows73'])if(map[key]){const g=map[key].map(r=>[...r]);if(old.y===y&&old.x!==x&&old.x!==x+1)g[old.y][old.x]='#';for(let i=0;i<2;i++)g[y][x+i]=key==='rows'?'D':'.';map[key]=g.map(r=>r.join(''));}
 return map;
}
export function connectStation160(maps){const a=maps.manikereo?.warps.filter(w=>w.station160);if(a?.length===2&&maps.manikereoStation)maps.manikereoStation.warps=maps.manikereoStation.warps.map(w=>w.to==='manikereo'?{...w,tx:a[0].x,ty:a[0].y+1}:w);}
