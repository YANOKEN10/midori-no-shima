import {FASHION_TOWNS} from './fashion.js';
export function addFashionShops(M){
 for(const [id,[name]]of Object.entries(FASHION_TOWNS)){
  const m=M[id],w=m.g[0].length,h=m.g.length;
  const plants=new Set(['tree','fir','snowFir','ePalm']);
  const clear=(x,y)=>{
   if(x<3||y<3||x+4>w-3||y+5>h-3)return false;
   if([...m.npcs,...m.signs,...m.warps,m.spawn].some(n=>n.x>=x-1&&n.x<x+5&&n.y>=y-1&&n.y<y+6))return false;
   if(m.props.some(p=>!plants.has(p.art)&&p.x<x+4&&p.x+p.w>x&&p.y<y+5&&p.y+p.h>y))return false;
   for(let yy=y;yy<y+5;yy++)for(let xx=x;xx<x+4;xx++)if(![',','F','T'].includes(m.g[yy][xx]))return false;
   return true;
  };
  let pos=['village','rods'].includes(id)&&clear(19,5)?[19,5]:null;
  if(!pos){const candidates=[];for(let y=3;y<h-7;y++)for(let x=3;x<w-6;x++)if(clear(x,y)){let distance=999;for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++)if(m.g[yy][xx]==='.')distance=Math.min(distance,Math.abs(xx-x-1)+Math.abs(yy-y-4));candidates.push({x,y,distance});}candidates.sort((a,b)=>a.distance-b.distance||a.y-b.y||a.x-b.x);if(candidates[0])pos=[candidates[0].x,candidates[0].y];}
  if(!pos)throw Error('No safe fashion shop site: '+id);
  const[x,y]=pos,removed=m.props.filter(p=>plants.has(p.art)&&p.x<x+4&&p.x+p.w>x&&p.y<y+5&&p.y+p.h>y);
  m.props=m.props.filter(p=>!removed.includes(p));for(const p of removed)for(let yy=p.y;yy<p.y+p.h;yy++)for(let xx=p.x;xx<p.x+p.w;xx++)if(m.g[yy][xx]==='T')m.g[yy][xx]=',';
  m.townGardens=(m.townGardens||[]).filter(p=>!(p.x<x+4&&p.x+p.w>x&&p.y<y+5&&p.y+p.h>y));
  for(let yy=y;yy<y+4;yy++)for(let xx=x;xx<x+4;xx++)m.g[yy][xx]='#';
  const dx=x+1,dy=y+3,target='fashion-'+id;m.g[dy][dx]='D';
  m.props.push({art:'harborShop',x,y,w:4,h:4,door:{x:dx,y:dy},label:'ふくや',fashionShop:true});
  m.warps.push({x:dx,y:dy,to:target,tx:7,ty:9,back:{map:id,x:dx,y:dy+1}});
  // Join the new entrance without moving an existing building or blocking a street.
  if(m.authoredTownStreets)for(let yy=dy+1;yy<18;yy++)for(let xx=dx;xx<dx+2;xx++)if([',','F','.'].includes(m.g[yy][xx]))m.g[yy][xx]='.';
  const q=[[dx,dy+1]],prev=new Map([[q[0].join(','),null]]);let end;
  for(let i=0;i<q.length&&!end;i++){const[a,b]=q[i];if(m.g[b][a]==='.')end=[a,b];else for(const[ox,oy]of [[0,1],[1,0],[-1,0],[0,-1]]){const xx=a+ox,yy=b+oy,k=xx+','+yy;if([',','F','.'].includes(m.g[yy]?.[xx])&&!prev.has(k)){prev.set(k,[a,b]);q.push([xx,yy]);}}}
  if(!end)throw Error('Fashion shop street not connected: '+id);
  while(end){const[a,b]=end;m.g[b][a]='.';if([',','F'].includes(m.g[b][a+1])&&!m.signs.some(s=>s.x===a+1&&s.y===b))m.g[b][a+1]='.';end=prev.get(end.join(','));}
  const room=structuredClone(M.shop);room.id=target;room.name=name+'のふくや';room.fashionTown=id;room.room.shopTown=id;room.room.theme='shop';room.npcs=[{x:7,y:4,name:'ふくやの店員',variant:5,look:'clerk',dir:'down',noRoam:true,clothes:id,talk:[name+'のふくやへ ようこそ！','ぼうし・ふく・ズボン・くつを 試着できるよ。']}];room.warps=[{x:7,y:11,to:'@back'}];room.spawn={x:7,y:9};M[target]=room;
  m.fashionShop={x:dx,y:dy,to:target};m.props.sort((a,b)=>a.y+a.h-b.y-b.h);
 }
}
