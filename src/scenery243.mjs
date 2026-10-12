const arches=new Set(['reference78-flower-arch','reference78-pergola']);
export function scenerySource243(p){
 if(!p)return p;
 const art=p.art||p.key;
 if(arches.has(art))return {...p,walkable:true,overhead230:true,mask:['...','...','#.#'],tile:','};
 if(art==='station'||art==='legacy73-station'){
  const empty=Math.max(0,Math.floor(p.h-p.w*223/375));
  if(empty)return {...p,mask:Array.from({length:p.h},(_,y)=>(y<empty?'.':'#').repeat(p.w)),visualFootprint243:true};
 }
 return p;
}
export function upgradeScenery243(d){
 if(d.scenery243)return d;
 return {...d,scenery243:true,objects:d.objects.map(o=>o.template!=='reference78-plaster-wall'?o:{...o,x:o.x+([0,0,0,1][o.turn81||0]),y:o.y+([1,0,0,0][o.turn81||0])})};
}
