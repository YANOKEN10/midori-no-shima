// ガオン・ワールド専用の第三世代フィールド構成。
// 旧16マス盤面を拡大表示せず、屋外全域を十分な広さの地形として再構築する。
const PAD = 4;
const MIN_W = 24;
const MIN_H = 22;

const WATER = new Set(["village","harbor","aqua","route1","route5","inlet","river"]);
const LAKE = new Set(["harbor","aqua","inlet"]);
const SNOW = new Set(["sky","route6","cloud"]);
const ROCK = new Set(["stone","route4","volcano","flame","starhill"]);
const FOREST = new Set(["mount1","mount2","forest","route3","deepforest"]);
const TOWN = new Set(["village","harbor","sand","forest","stone","aqua","sky","flame","galaxy","gate"]);
const SOLID_LANDMARKS = new Set([
  "alpineCabin","alpineLodge","alpineBoathouse","alpineWorkshop","alpineHerbalist",
  "alpineSnowChalet","alpineRailStation","alpineObservatory",
]);

function axis(v, oldSize, newSize) {
  if (v <= 0) return 0;
  if (v >= oldSize - 1) return newSize - 1;
  return Math.min(newSize - 2, v + PAD);
}

function point(value, info) {
  if (!value || value.x == null || value.y == null) return;
  value.x = axis(value.x, info.ow, info.nw);
  value.y = axis(value.y, info.oh, info.nh);
}

function rngFor(text) {
  let n = 2166136261;
  for (const c of text) n = Math.imul(n ^ c.charCodeAt(0), 16777619) >>> 0;
  return () => ((n = (Math.imul(n, 1664525) + 1013904223) >>> 0) / 4294967296);
}

function set(g,x,y,ch) {
  if (y >= 0 && y < g.length && x >= 0 && x < g[0].length) g[y][x] = ch;
}

function disc(g,cx,cy,rx,ry,ch) {
  for(let y=cy-ry;y<=cy+ry;y++) for(let x=cx-rx;x<=cx+rx;x++) {
    const dx=(x-cx)/Math.max(1,rx),dy=(y-cy)/Math.max(1,ry);
    if(dx*dx+dy*dy<=1.08) set(g,x,y,ch);
  }
}

function road(g,a,b,width=1) {
  let x=a.x,y=a.y;
  const horizontalFirst=((a.x+a.y+b.x+b.y)&1)===0;
  const paint=()=>{for(let yy=y-width;yy<=y+width;yy++)for(let xx=x-width;xx<=x+width;xx++)set(g,xx,yy,g[yy]?.[xx]==="W"?"d":".");};
  paint();
  const walkX=()=>{while(x!==b.x){x+=Math.sign(b.x-x);paint();}};
  const walkY=()=>{while(y!==b.y){y+=Math.sign(b.y-y);paint();}};
  if(horizontalFirst){walkX();walkY();}else{walkY();walkX();}
}

function clear(g,p,r=1,ch=",") {
  for(let y=p.y-r;y<=p.y+r;y++)for(let x=p.x-r;x<=p.x+r;x++)if(g[y]?.[x]!=="W")set(g,x,y,ch);
}

function collectPoints(map) {
  const out=[];
  for(const key of ["warps","npcs","signs","items","objects"]) for(const p of map[key]||[]) if(p.x!=null) out.push(p);
  for(const lm of map.landmarks||[]) out.push({x:lm.x+Math.floor((lm.w||4)/2),y:lm.y+(lm.h||4)-1});
  return out;
}

function landmarkAt(map,x,y) {
  return (map.landmarks||[]).find(lm=>SOLID_LANDMARKS.has(lm.art)&&x>=lm.x&&x<lm.x+(lm.w||4)&&y>=lm.y&&y<lm.y+(lm.h||4));
}

function doorOf(lm){return {x:lm.x+Math.floor((lm.w||4)/2),y:lm.y+(lm.h||4)-1};}

function carve(g,map,start,target,width=1){
  const w=g[0].length,h=g.length,key=(x,y)=>`${x},${y}`;
  const queue=[[start.x,start.y]],seen=new Set([key(start.x,start.y)]),prev=new Map();
  let end=null;
  while(queue.length){const [x,y]=queue.shift();if(x===target.x&&y===target.y){end=[x,y];break;}
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,k=key(nx,ny);if(nx<1||ny<1||nx>=w-1||ny>=h-1||seen.has(k))continue;
      const lm=landmarkAt(map,nx,ny),isEnd=nx===target.x&&ny===target.y;
      if(lm&&!isEnd)continue;seen.add(k);prev.set(k,[x,y]);queue.push([nx,ny]);}
  }
  if(!end)return;
  for(let cur=end;cur;){const [x,y]=cur;for(let yy=y-width;yy<=y+width;yy++)for(let xx=x-width;xx<=x+width;xx++)if(!landmarkAt(map,xx,yy))set(g,xx,yy,g[yy]?.[xx]==="W"?"d":".");cur=prev.get(key(x,y));}
}

function build(id,map,info) {
  const {nw:w,nh:h}=info, random=rngFor(id), base=SNOW.has(id)?",":",";
  const border=ROCK.has(id)?"M":"T";
  const g=Array.from({length:h},()=>Array(w).fill(base));
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(x<2||y<2||x>=w-2||y>=h-2)g[y][x]=border;

  if(WATER.has(id)) {
    if(LAKE.has(id)) {
      disc(g,w-5,Math.floor(h/2),5,Math.floor(h*.38),"W");
    } else {
      const cx=Math.floor(w*.58);
      for(let y=1;y<h-1;y++){
        const bend=Math.round(Math.sin((y+(id.length%5))*0.5));
        set(g,cx+bend,y,"W");set(g,cx+bend+1,y,"W");set(g,cx+bend+2,y,"W");
      }
    }
  }

  if(ROCK.has(id)) {
    for(let x=3;x<w-3;x++) if(x%5!==0){set(g,x,5,"M");if(x%3)set(g,x,6,"M");}
  }

  const points=collectPoints(map);
  let hub=TOWN.has(id)?{x:Math.floor(w/2)-2,y:Math.floor(h/2)}:{x:Math.floor(w/2),y:Math.floor(h/2)};
  if(landmarkAt(map,hub.x,hub.y)){
    outer:for(let r=1;r<8;r++)for(let y=hub.y-r;y<=hub.y+r;y++)for(let x=hub.x-r;x<=hub.x+r;x++)if(!landmarkAt(map,x,y)){hub={x,y};break outer;}
  }
  clear(g,hub,2,".");
  for(const p of points){clear(g,p,1);road(g,p,hub,TOWN.has(id)?1:0);}

  // 町は建物前を石畳の広場、道中は草むらと自然障害で構成する。
  if(TOWN.has(id)) disc(g,hub.x,hub.y,4,3,".");
  for(const lm of map.landmarks||[]) {
    const door=doorOf(lm);
    for(let y=lm.y;y<lm.y+(lm.h||4);y++)for(let x=lm.x;x<lm.x+(lm.w||4);x++)set(g,x,y,",");
    clear(g,door,1,".");road(g,door,hub,1);
  }

  const protectedPoints=[hub,...points];
  const nearProtected=(x,y)=>protectedPoints.some(p=>Math.abs(p.x-x)<=2&&Math.abs(p.y-y)<=2);
  const obstacle=FOREST.has(id)?"T":ROCK.has(id)?"R":"T";
  for(let i=0;i<Math.floor(w*h*.13);i++){
    const x=2+Math.floor(random()*(w-4)),y=2+Math.floor(random()*(h-4));
    if(!nearProtected(x,y)&&g[y][x]===",")g[y][x]=obstacle;
  }
  for(let patch=0;patch<5;patch++){
    const cx=3+Math.floor(random()*(w-6)),cy=3+Math.floor(random()*(h-6));
    for(let y=cy-1;y<=cy+1;y++)for(let x=cx-2;x<=cx+2;x++)if(!nearProtected(x,y)&&g[y]?.[x]===",")g[y][x]='"';
  }
  for(let i=0;i<Math.floor(w*h*.035);i++){
    const x=2+Math.floor(random()*(w-4)),y=2+Math.floor(random()*(h-4));
    if(g[y][x]===",")g[y][x]="F";
  }
  for(const p of points) clear(g,p,1,g[p.y]?.[p.x]==="."?".":",");
  // 最終段階で建物を避けた経路を保証する。水上は桟道へ置換する。
  for(const p of points) carve(g,map,p,hub,TOWN.has(id)?1:0);
  for(const p of map.signs||[]) set(g,p.x,p.y,"S");
  return g.map(row=>row.join(""));
}

export function rebuildOutdoorWorld(maps) {
  const info={};
  for(const [id,map] of Object.entries(maps)) {
    map.id=id;
    if(map.kind!=="out") continue;
    const ow=map.rows[0].length,oh=map.rows.length;
    info[id]={ow,oh,nw:Math.max(MIN_W,ow+8),nh:Math.max(MIN_H,oh+8)};
  }

  for(const [id,meta] of Object.entries(info)) {
    const map=maps[id];
    for(const key of ["warps","npcs","signs","items","objects","ledges"]) {
      const list=map[key];
      if(Array.isArray(list)) for(const p of list) point(p,meta);
    }
    for(const lm of map.landmarks||[]) point(lm,meta);
    for(const key of ["warps","npcs","signs","items","objects"]) for(const p of map[key]||[]) {
      const lm=landmarkAt(map,p.x,p.y);
      if(lm){const d=doorOf(lm);p.x=d.x;p.y=d.y;}
    }
  }

  // ワープ先も、対象マップが屋外なら同じ座標変換を適用する。
  for(const map of Object.values(maps)) for(const warp of map.warps||[]) {
    const target=info[warp.to];
    if(target&&warp.tx!=null){warp.tx=axis(warp.tx,target.ow,target.nw);warp.ty=axis(warp.ty,target.oh,target.nh);}
    if(warp.back&&info[warp.back.map]) point(warp.back,info[warp.back.map]);
  }

  for(const [id,meta] of Object.entries(info)) maps[id].rows=build(id,maps[id],meta);
}
