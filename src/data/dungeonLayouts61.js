// Stable mazes: two-tile passages, connected branches and preserved event coordinates.
const dirs=[[1,0],[-1,0],[0,1],[0,-1]];
export function refineMaps61(M){
 const r=M.rods;
 // Remove scattered flowers and their small fences before laying uniform beds.
 for(const row of r.g)for(let x=0;x<row.length;x++)if(row[x]==='F'||row[x]==='=')row[x]=',';
 r.props=r.props.filter(p=>p.art!=='v41-fence');r.townGardens=[];
 const occupied=(x,y)=>r.props.some(p=>x>=p.x&&x<p.x+p.w&&y>=p.y&&y<p.y+p.h)||[...r.npcs,...r.signs,...r.warps,r.spawn].some(p=>Math.abs(p.x-x)<=1&&Math.abs(p.y-y)<=1);
 for(const y of [4,13,20,24])for(const x of [3,8,20,25]){
  let ok=true;for(let yy=y;yy<y+2;yy++)for(let xx=x;xx<x+3;xx++)if(r.g[yy]?.[xx]!==','||occupied(xx,yy))ok=false;
  if(ok){r.townGardens.push({x,y,w:3,h:2});for(let yy=y;yy<y+2;yy++)for(let xx=x;xx<x+3;xx++)r.g[yy][xx]='F';}
 }
 // Keep the north/south main route, replace every short side spur with meadow.
 const route=M.route2;for(let y=0;y<route.g.length;y++)for(let x=1;x<route.g[y].length-1;x++)if(route.g[y][x]==='.'&&x!==14&&x!==15&&!route.warps.some(p=>p.x===x&&p.y===y))route.g[y][x]=',';
 for(const [id,seed] of [['natureforest',611],['forgottenRuins',787],['shadowDepths',997]])maze(M[id],M,seed);
 const j=M.mossSanctuary;j.jungle61=true;
 for(const row of j.g)for(let x=0;x<row.length;x++)if(row[x]==='.')row[x]=',';
 for(const s of j.signs)if(s.ground==='.')s.ground=',';
}
function maze(m,M,seed){
 const w=m.g[0].length,h=m.g.length,forest=m.id==='natureforest',wall=forest?'T':'R',floor=forest?',':'C';
 const incoming=Object.values(M).flatMap(a=>a.warps.filter(p=>p.to===m.id&&Number.isFinite(p.tx)&&Number.isFinite(p.ty)).map(p=>({x:p.tx,y:p.ty})));
 const anchors=[m.spawn,...m.warps,...incoming,...m.npcs,...m.items,...m.signs].filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y));
 m.g=Array.from({length:h},()=>Array(w).fill(wall));m.props=[];m.forestBorder=false;m.maze61=true;m.explorationDesign=true;
 delete m.townGardens;delete m.ruinRooms;
 const carve=(x,y)=>{if(x>=0&&y>=0&&x<w&&y<h)m.g[y][x]=floor;};
 const room=(x,y)=>{for(let yy=y;yy<y+2;yy++)for(let xx=x;xx<x+2;xx++)carve(xx,yy);};
 const cols=Math.floor((w-2)/4),rows=Math.floor((h-2)/4),seen=new Set(['0,0']),stack=[[0,0]];
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 room(2,2);
 while(stack.length){const [a,b]=stack.at(-1),next=dirs.map(([dx,dy])=>[a+dx,b+dy]).filter(([x,y])=>x>=0&&y>=0&&x<cols&&y<rows&&!seen.has(x+','+y));
  if(!next.length){stack.pop();continue;}const [x,y]=next[Math.floor(random()*next.length)];
  for(let k=0;k<=4;k++)room(2+a*4+Math.sign(x-a)*k,2+b*4+Math.sign(y-b)*k);
  seen.add(x+','+y);stack.push([x,y]);
 }
 // Attach each existing entry, trainer, sign and event to its nearest corridor.
 // This preserves all warp destinations and story identifiers.
 for(const p of anchors){let best=null,dist=Infinity;for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++)if(m.g[y][x]===floor){const d=Math.abs(x-p.x)+Math.abs(y-p.y);if(d<dist){dist=d;best=[x,y];}}
  let x=p.x,y=p.y;carve(x,y);while(x!==best[0]){x+=Math.sign(best[0]-x);carve(x,y);carve(x,Math.min(h-2,y+1));}while(y!==best[1]){y+=Math.sign(best[1]-y);carve(x,y);carve(Math.min(w-2,x+1),y);}
  for(const [dx,dy]of dirs){const a=p.x+dx,b=p.y+dy;if(a>0&&b>0&&a<w-1&&b<h-1)carve(a,b);}
 }
 // Encounter patches occupy full corridor segments; navigation remains readable.
 if(forest)for(let y=2;y<h-2;y+=4)for(let x=2;x<w-2;x+=4)if((x+y)%12!==0){for(let yy=y;yy<y+2;yy++)for(let xx=x;xx<x+2;xx++)if(m.g[yy]?.[xx]===floor&&!anchors.some(p=>Math.abs(p.x-xx)+Math.abs(p.y-yy)<3))m.g[yy][xx]='"';}
 for(const s of m.signs){m.g[s.y][s.x]='S';s.ground=floor;}
 // Keep entrances unblocked, including adjacent lanes added by link().
 for(const p of [...m.warps,...incoming,m.spawn])carve(p.x,p.y);
 if(forest){const covered=new Set();for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(m.g[y][x]==='T'&&!covered.has(x+','+y)){
  const ww=x+1<w&&m.g[y][x+1]==='T'?2:1;let hh=y+1<h&&m.g[y+1].slice(x,x+ww).every(c=>c==='T')?2:1;
  for(let b=y;b<y+hh;b++)for(let a=x;a<x+ww;a++)covered.add(a+','+b);
  m.props.push({art:'tree',x,y,w:ww,h:hh});
 }}
}
