// Bounded encounter plots separated by two cells of ordinary ground.
export function composeGrassPlots(maps){
 for(const m of Object.values(maps)){
  if(!(/^route\d+$/.test(m.id)||['mountain','natureforest','mossSanctuary'].includes(m.id)))continue;
  const h=m.g.length,w=m.g[0].length,original=new Set();
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(m.g[y][x]==='"'){original.add(x+','+y);m.g[y][x]=',';}
  if(!original.size)continue;
  const blocked=new Set();for(const n of [...m.npcs,...m.signs,...m.warps,m.spawn])for(let y=n.y-1;y<=n.y+1;y++)for(let x=n.x-1;x<=n.x+1;x++)blocked.add(x+','+y);
  m.grassPlots=[];let count=0;const budget=Math.max(18,Math.floor(original.size*.38));
  for(const[pw,ph]of [[5,4],[4,3],[3,3],[3,2]])for(let y=3;y<h-ph-2;y++)for(let x=3;x<w-pw-2;x++){
   if(count+pw*ph>budget)continue;let ok=true;
   for(let yy=y;yy<y+ph;yy++)for(let xx=x;xx<x+pw;xx++)if(!original.has(xx+','+yy)||blocked.has(xx+','+yy)||m.g[yy][xx]!==',')ok=false;
   if(!ok)continue;m.grassPlots.push({x,y,w:pw,h:ph});count+=pw*ph;
   for(let yy=y;yy<y+ph;yy++)for(let xx=x;xx<x+pw;xx++)m.g[yy][xx]='"';
   for(let yy=y-2;yy<y+ph+2;yy++)for(let xx=x-2;xx<x+pw+2;xx++)blocked.add(xx+','+yy);
  }
 }
}
