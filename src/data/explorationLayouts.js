// Region-scale composition: connected habitats, forest margins and authored rooms.
export function refineExploration(M){
 for(const m of Object.values(M)){
  if(!/^route(?:[1-9]|1[0-8])$/.test(m.id)&&!['natureforest','kageri','momi','blizzard','glacier'].includes(m.id))continue;
  const h=m.g.length,w=m.g[0].length;
  m.explorationDesign=true;
  const reserved=(x,y)=>[...m.npcs,...m.signs,...m.warps,m.spawn].some(p=>Math.abs(p.x-x)<=1&&Math.abs(p.y-y)<=1);
  // Later routes previously used diagonal modular stripes. Replace only open
  // meadow cells, preserving all paths, buildings, water and story coordinates.
  if(m.frontierTheme){
   for(let y=2;y<h-2;y++)for(let x=2;x<w-2;x++)if(m.g[y][x]==='"')m.g[y][x]=',';
   const plots=[];
   for(let y=6,k=0;y<h-5;y+=13,k++){
    plots.push([k%2?Math.floor(w*.68):Math.floor(w*.27),y,Math.floor(w*.24),7]);
    if(k%2===0)plots.push([Math.floor(w*.73),y+3,Math.floor(w*.18),5]);
   }
   for(const[cx,cy,rx,ry]of plots)for(let y=Math.max(2,cy-ry);y<Math.min(h-2,cy+ry);y++)for(let x=Math.max(2,cx-rx);x<Math.min(w-2,cx+rx);x++){
    if(m.g[y][x]!==','||reserved(x,y))continue;
    if(((x-cx)/rx)**2+((y-cy)/ry)**2<1.15)m.g[y][x]='"';
   }
  }
  // Complete stands along the perimeter, never over a bridge, an entrance,
  // solar equipment or a saved event position.
  const art=m.endTheme==='dark'?'eDarkTree':m.endTheme==='snow'?'eFir':m.endTheme==='ice'?'eIce':m.frontierTheme==='snow'?'snowFir':'tree';
  const plant=(x,y)=>{
   for(let yy=y;yy<y+3;yy++)for(let xx=x;xx<x+2;xx++)if(!['T','X',',','"'].includes(m.g[yy]?.[xx])||reserved(xx,yy)||m.props.some(p=>xx>=p.x&&xx<p.x+p.w&&yy>=p.y&&yy<p.y+p.h))return;
   for(let yy=y;yy<y+3;yy++)for(let xx=x;xx<x+2;xx++)m.g[yy][xx]='T';
   m.props.push({art,x,y,w:2,h:3});
  };
  if(!['glacier','blizzard'].includes(m.id)){for(let y=0;y<h-2;y+=2){plant(0,y);plant(w-2,y);}for(let x=2;x<w-2;x+=2){plant(x,0);plant(x,h-3);}}
  if(['route14','blizzard','glacier'].includes(m.id))m.continuousCliffs=true;
  m.props.sort((a,b)=>a.y+a.h-b.y-b.h);
 }
 compactTownGardens(M);
 for(let floor=1;floor<=4;floor++)redesignRuins(M['dark'+floor],floor);
}
function redesignRuins(m,floor){
 const w=m.g[0].length,h=m.g.length;
 m.g=Array.from({length:h},()=>Array(w).fill('R'));m.props=[];
 m.ruinRooms=true;m.explorationDesign=true;
 const rect=(x,y,ww,hh,ch=',')=>{for(let yy=y;yy<y+hh;yy++)for(let xx=x;xx<x+ww;xx++)if(m.g[yy]?.[xx]!=null)m.g[yy][xx]=ch;};
 const join=(a,b)=>{rect(Math.min(a[0],b[0])-1,a[1]-1,Math.abs(a[0]-b[0])+3,3,'.');rect(b[0]-1,Math.min(a[1],b[1])-1,3,Math.abs(a[1]-b[1])+3,'.');};
 const centers=[];for(const y of [8,23,39,54])for(const x of [7,20,34]){centers.push([x,y]);const wide=(x+floor+y)%3===0;rect(x-4,y-4,wide?10:9,(y+floor)%2?10:9);}
 // Floor-specific connectors lead through alternating side galleries.
 join([20,0],[20,8]);join([20,54],[20,63]);
 for(let row=0;row<4;row++){
  const y=[8,23,39,54][row],offset=(row+floor)%2?2:-2;
  join([7,y],[20,y+offset]);join([34,y],[20,y-offset]);
  if(row<3&&(row+floor)%2===0)join([7,y],[7,[8,23,39,54][row+1]]);
  if(row<3&&(row+floor)%2===1)join([34,y],[34,[8,23,39,54][row+1]]);
 }
 // The former route trainers retain their teams and dialogue in side galleries.
 let i=0;for(const n of m.npcs){if(n.trainer){const pos=centers[(i++*3+floor)%centers.length];n.x=pos[0]+2;n.y=pos[1]+1;}else join([n.x,n.y],[20,n.y]);}
 for(const point of [...m.warps,m.spawn]){join([point.x,point.y],[20,point.y]);m.g[point.y][point.x]='.';}
 const protectedAt=(x,y)=>[...m.npcs,...m.warps,m.spawn].some(n=>Math.abs(n.x-x)<=1&&Math.abs(n.y-y)<=1);
 for(let j=0;j<centers.length;j++){
  const[x,y]=centers[j],xx=x-3,yy=y-3;
  if(protectedAt(xx,yy)||protectedAt(xx+2,yy+1))continue;
  const art=j%3===0?'v41-interiors-6':j%3===1?'v41-interiors-5':'v41-facilities-7',ww=j%3===2?1:3,hh=2;
  let clear=true;for(let b=yy;b<yy+hh;b++)for(let a=xx;a<xx+ww;a++)if(m.g[b][a]!==',')clear=false;
  if(clear){rect(xx,yy,ww,hh,'t');m.props.push({art,x:xx,y:yy,w:ww,h:hh});}
 }
 m.props.sort((a,b)=>a.y+a.h-b.y-b.h);
}

function compactTownGardens(M){
 for(const id of ['village','rods','marine','karat','resure','manikereo','galaxy','clearTown','belerio','leafTown']){
  const m=M[id];if(!m)continue;const h=m.g.length,w=m.g[0].length;m.explorationDesign=true;m.townGardens||=[];
  const reserved=new Set();
  const reserve=(x,y,r)=>{for(let yy=y-r;yy<=y+r;yy++)for(let xx=x-r;xx<=x+r;xx++)reserved.add(xx+','+yy);};
  for(const n of m.npcs)reserve(n.x,n.y,n.noRoam?1:3);
  for(const p of [...m.warps,...m.signs,m.spawn])reserve(p.x,p.y,1);
  for(const p of m.props)for(let y=p.y;y<p.y+p.h;y++)for(let x=p.x;x<p.x+p.w;x++)reserved.add(x+','+y);
  // Keep explicit routes to every resident and entrance before filling vacant lots.
  const start=m.warps.find(p=>m.g[p.y]?.[p.x]==='.')||m.spawn,q=[[start.x,start.y]],parent=new Map([[start.x+','+start.y,null]]);
  const open=(x,y)=>['.',',','F','D','d','"'].includes(m.g[y]?.[x]);
  for(let i=0;i<q.length;i++){const[x,y]=q[i];for(const[dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy,k=xx+','+yy;if(open(xx,yy)&&!parent.has(k)){parent.set(k,x+','+y);q.push([xx,yy]);}}}
  for(const n of [...m.npcs,...m.warps,m.spawn]){let k=n.x+','+n.y;if(!parent.has(k)){const p=[[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dy])=>[n.x+dx,n.y+dy]).find(([x,y])=>parent.has(x+','+y));if(!p)continue;k=p.join(',');}while(k){reserved.add(k);k=parent.get(k);}}
  // Expand only single-lane approach paths, keeping the main streets at 2–3 tiles.
  const widen=[];for(let y=2;y<h-2;y++)for(let x=2;x<w-2;x++)if(m.g[y][x]==='.'&&m.g[y][x-1]!=='.'&&m.g[y][x+1]!=='.'&&m.g[y][x+1]===','&&!reserved.has((x+1)+','+y))widen.push([x+1,y]);
  for(const[x,y]of widen)m.g[y][x]='.';
  let count=0;
  for(let y=3;y<h-4;y++)for(let x=3;x<w-4;x++){
   let clear=true;for(let yy=y;yy<y+3;yy++)for(let xx=x;xx<x+3;xx++)if(m.g[yy]?.[xx]!==','||reserved.has(xx+','+yy))clear=false;
   if(!clear)continue;
   for(let yy=y-2;yy<y+5;yy++)for(let xx=x-2;xx<x+5;xx++)reserved.add(xx+','+yy);
   const kind=count++%4;
   if(kind<2){m.townGardens.push({x,y,w:3,h:2});for(let yy=y;yy<y+2;yy++)for(let xx=x;xx<x+3;xx++)m.g[yy][xx]='F';for(let xx=x;xx<x+3;xx++)m.g[y+2][xx]='=';}
   else{const art=kind===2?(m.frontierTheme==='snow'?'snowFir':m.endTheme==='tropical'?'ePalm':'tree'):'v41-facilities-7';const ww=kind===2?2:1,hh=kind===2?3:2;for(let yy=y;yy<y+hh;yy++)for(let xx=x;xx<x+ww;xx++)m.g[yy][xx]='T';m.props.push({art,x,y,w:ww,h:hh});}
  }
  // Low planting also fits the residents' walking areas without blocking them.
  for(let y=4;y<h-4;y+=5)for(let x=4+(y%2);x<w-4;x+=5){
   let clear=true;for(let yy=y;yy<y+2;yy++)for(let xx=x;xx<x+2;xx++)if(m.g[yy]?.[xx]!==','||m.props.some(p=>xx>=p.x&&xx<p.x+p.w&&yy>=p.y&&yy<p.y+p.h)||[...m.npcs,...m.warps,...m.signs].some(p=>Math.abs(p.x-xx)<=1&&Math.abs(p.y-yy)<=1))clear=false;
   if(clear){m.townGardens.push({x,y,w:2,h:2});for(let yy=y;yy<y+2;yy++)for(let xx=x;xx<x+2;xx++)m.g[yy][xx]='F';count++;}
  }
  m.townInfill=count;m.props.sort((a,b)=>a.y+a.h-b.y-b.h);
 }
}
