// A continuous encounter-free trail, broad habitats and grouped forest stands.
export function organizeMountain(m){
 const h=m.g.length,w=m.g[0].length;
 m.props=m.props.filter(p=>!['tree','fir','mountainCrag'].includes(p.art));
 for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++)if(m.g[y][x]!=='.')m.g[y][x]='"';
 // Preserve every authored path, entrance, story NPC and the summit clearing.
 for(const n of m.npcs)m.g[n.y][n.x]='.';
 const clear=(x,y,ww,hh)=>{
  for(let yy=y-1;yy<y+hh+1;yy++)for(let xx=x-1;xx<x+ww+1;xx++)if(m.g[yy]?.[xx]==='.')return false;
  return x>0&&y>0&&x+ww<w-1&&y+hh<h-1;
 };
 // Asymmetric groves, rather than a regular grid of isolated trees.
 const groves=[[2,4,6,12],[22,8,6,12],[2,24,5,12],[23,32,5,12],[2,44,6,10],[11,34,6,8],[13,15,5,6]];
 for(const [gx,gy,gw,gh]of groves)for(let y=gy;y<gy+gh-2;y+=2)for(let x=gx;x<gx+gw-1;x+=2){
  if(!clear(x,y,2,3))continue;
  for(let yy=y;yy<y+3;yy++)for(let xx=x;xx<x+2;xx++)m.g[yy][xx]='T';
  m.props.push({art:(x+y)%3?'fir':'tree',x,y,w:2,h:3});
 }
 for(const [x,y,ww,hh]of [[3,19,3,3],[24,25,3,4],[3,37,3,3],[24,49,3,4]])if(clear(x,y,ww,hh)){
  for(let yy=y;yy<y+hh;yy++)for(let xx=x;xx<x+ww;xx++)m.g[yy][xx]='R';
  m.props.push({art:'mountainCrag',x,y,w:ww,h:hh});
 }
 // Dense perimeter crowns frame the mountain; only the two trail exits open it.
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)if((x<2||x>=w-2||y<3||y>=h-3)&&m.g[y][x]!=='.')m.g[y][x]='T';
 m.props.sort((a,b)=>a.y+a.h-b.y-b.h);
}
