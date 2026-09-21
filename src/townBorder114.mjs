// Migrate the standard enclosing tree rows without replacing edited town layouts.
export function enclosedTown114(base){
 if(!base.townDesign||!base.forestBorder)return false;
 const w=base.rows[0].length,h=base.rows.length;
 return base.props.filter(p=>/^(tree|fir)$/.test(p.art)&&(p.x===0||p.x+p.w===w||p.y===0||p.y+p.h===h)).length>=10;
}
export function upgradeTownBorder114(base,doc){
 if(doc.townBorder114||!enclosedTown114(base))return doc;
 const w=base.rows[0].length,h=base.rows.length;
 const objects=doc.objects.map(o=>{
  if(!/^p:\d+$/.test(o.id)||o.stored79||o.turn81)return o;
  const p=base.props[Number(o.id.slice(2))];
  if(!p||! /^(tree|fir)$/.test(p.art)||o.x!==p.x||o.y!==p.y)return o;
  // Side rows already touch the edge. Keep whole crowns there to avoid gaps.
  const side=p.x===0||p.x+p.w===w,x=p.x;
  const y=side?p.y:p.y===0?-1:p.y+p.h===h?h-2:p.y;
  return x===o.x&&y===o.y?o:{...o,x,y};
 });
 for(const [label,x]of [['left',0],['right',w-2]]){
  const original=base.props.findIndex(p=>p.art==='tree'&&p.x===x&&p.y===0);
  const o=doc.objects.find(o=>o.id==='p:'+original);
  if(o&&!o.stored79&&!o.turn81&&o.x===x&&o.y===0)objects.push({id:'a:border114-'+label,type:'prop',template:'legacy73-world-v19-tree',x,y:-1});
 }
 return {...doc,townBorder114:true,objects};
}
