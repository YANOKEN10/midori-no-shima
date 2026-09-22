// Migrate the standard enclosing tree rows without replacing edited town layouts.
export function enclosedTown114(base){
 if(base.id==='natureforest')return true;
 if(!base.forestBorder)return false;
 const w=base.rows[0].length,h=base.rows.length;
 return base.props.filter(p=>/^(tree|fir)$/.test(p.art)&&(p.x===0||p.x+p.w===w||p.y===0||p.y+p.h===h)).length>=10;
}
export function upgradeTownBorder114(base,doc){
 if(base.id==='natureforest')return upgradeNatureBorder132(base,doc);
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

// Fill omissions in the original perimeter; never restore trees a user moved or removed.
export function upgradeForestBorder132(base,doc){
 if(base.id==='natureforest'||doc.forestBorder132||!enclosedTown114(base))return doc;
 const w=base.rows[0].length,h=base.rows.length,objects=[...doc.objects];
 const originals=base.props.filter(p=>/^(tree|fir)$/.test(p.art));
 const slots=[];
 for(let x=0;x<w-1;x+=2){slots.push({x,y:-1,edgeY:0,side:'top'},{x,y:h-2,edgeY:h-1,side:'bottom'});}
 for(const x of [0,w-2])for(let y=0;y<=h-3;y+=2)slots.push({x,y,edgeX:x===0?0:w-1,side:x===0?'left':'right'});
 for(const t of slots){
  const cells=t.edgeY!==undefined?[[t.x,t.edgeY],[t.x+1,t.edgeY]]:[[t.edgeX,t.y],[t.edgeX,t.y+1]];
  if(cells.some(([x,y])=>base.rows[y]?.[x]!=='T'||doc.tiles.some(e=>e.x===x&&e.y===y)))continue;
  const covers=p=>t.edgeY!==undefined?p.x<=t.x&&p.x+p.w>=t.x+2&&(t.side==='top'?p.y===0:p.y+p.h>=h):p.x===t.x&&p.y<=t.y&&p.y+p.h>=t.y+2;
  if(originals.some(covers))continue;
  if(objects.some(o=>!o.id.startsWith('g:')&&!o.stored79&&/tree|fir|conifer/i.test(o.template)&&cells.every(([x,y])=>x>=o.x&&x<o.x+2&&y>=o.y&&y<o.y+3)))continue;
  if(base.warps.some(a=>a.x>=t.x&&a.x<t.x+2&&a.y>=t.y&&a.y<t.y+3))continue;
  objects.push({id:'a:border132-'+t.side+'-'+t.x+'-'+t.y,type:'prop',template:'legacy73-world-v19-tree',x:t.x,y:t.y});
 }

 const live=()=>objects.filter(o=>!o.stored79&&!o.id.startsWith('g:')&&/tree|fir|conifer/i.test(o.template));
 const covered=(x,y)=>live().some(o=>x>=o.x&&x<o.x+2&&y>=o.y&&y<o.y+3);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  if(x!==0&&x!==w-1&&y!==0&&y!==h-1||base.rows[y][x]!=='T'||covered(x,y))continue;
  // A missing original tree was intentionally edited; do not put it back.
  if(originals.some(p=>x>=p.x&&x<p.x+p.w&&y>=p.y&&y<p.y+p.h))continue;
  const horizontal=y===0||y===h-1,candidates=horizontal?[[x,y===0?-1:h-2],[x-1,y===0?-1:h-2]]:[[x===0?0:w-2,y],[x===0?0:w-2,y-1],[x===0?0:w-2,y-2]];
  for(const [tx,ty]of candidates){
   const cells=horizontal?[[tx,y],[tx+1,y]]:[[x,ty],[x,ty+1],[x,ty+2]];
   if(cells.some(([a,b])=>!['T','R'].includes(base.rows[b]?.[a])||doc.tiles.some(t=>t.x===a&&t.y===b)))continue;
   if([...base.warps,...base.npcs].some(a=>a.x>=tx&&a.x<tx+2&&a.y>=ty&&a.y<ty+3))continue;
   objects.push({id:'a:border132-cap-'+x+'-'+y,type:'prop',template:'legacy73-world-v19-tree',x:tx,y:ty});break;
  }
 }
 return {...doc,forestBorder132:true,objects};
}

function upgradeNatureBorder132(base,doc){
 if(doc.natureBorder132)return doc;
 const w=base.rows[0].length,h=base.rows.length,outer=p=>p&&p.art==='tree'&&(p.x===0||p.y===0||p.x+p.w>=w||p.y+p.h>=h),originals=base.props.map((p,i)=>({...p,id:'p:'+i})).filter(outer),lookup=new Map(doc.objects.map(o=>[o.id,o])),unchanged=p=>{const o=lookup.get(p.id);return o&&!o.stored79&&!o.turn81&&o.x===p.x&&o.y===p.y;},protectedCells=originals.filter(p=>!unchanged(p)),remove=new Set(originals.filter(unchanged).map(p=>p.id)),objects=doc.objects.filter(o=>!remove.has(o.id)),added=[];
 const protectedAt=(x,y)=>protectedCells.some(p=>x>=p.x&&x<p.x+p.w&&y>=p.y&&y<p.y+p.h)||doc.tiles.some(t=>t.x===x&&t.y===y);
 const candidates=[];for(const step of [2,1]){for(let x=0;x<w;x+=step)for(const y of [-1,h-2])candidates.push([Math.min(x,w-2),y]);for(const x of [0,w-2])for(let y=0;y<h;y+=step)candidates.push([x,y]);}
 for(const [x,y]of candidates){const cells=[];for(let b=Math.max(0,y);b<Math.min(h,y+3);b++)for(let a=x;a<x+2;a++)if(a===0||a===w-1||b===0||b===h-1)cells.push([a,b]);if(!cells.length||cells.some(([a,b])=>base.rows[b]?.[a]!=='T'||protectedAt(a,b)))continue;if(cells.every(([a,b])=>added.some(o=>a>=o.x&&a<o.x+2&&b>=o.y&&b<o.y+3)))continue;if(base.warps.some(a=>a.x>=x&&a.x<x+2&&a.y>=y&&a.y<y+3))continue;added.push({id:'a:nature-border132-'+x+'-'+y,type:'prop',template:'legacy73-world-v19-tree',x,y});}
 return {...doc,natureBorder132:true,objects:[...objects,...added]};
}
