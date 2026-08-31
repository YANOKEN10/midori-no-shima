const TERRAIN_SRC = "../assets/revamp/terrain-atlas.png";
const HERO_SRC = "../assets/revamp/hero-atlas.png";
const TITLE_SRC = "../assets/revamp/title-alpine.png";

function image(src) {
  const im = new Image();
  im.decoding = "async";
  im.src = new URL(src, import.meta.url).href;
  return im;
}
const terrain = image(TERRAIN_SRC);
const hero = image(HERO_SRC);
const title = image(TITLE_SRC);
const heroFrames = new Map();

const CELLS = {
  meadow: [0,0], forest:[1,0], gravel:[2,0], cobble:[3,0],
  river:[0,1], lake:[1,1], bank:[2,1], shore:[3,1],
  cliff:[0,2], wall:[1,2], flowers:[2,2], grass:[3,2],
  snow:[0,3], ice:[1,3], wood:[2,3], stairs:[3,3],
};

function terrainName(ch, map) {
  const snow = map.sets && map.sets[","] === "snow";
  if (snow) {
    if (ch === "W") return "ice";
    if ([",","F","T","R","=","S"].includes(ch)) return "snow";
  }
  if (ch === "W") return /aqua|harbor|river|lake|village/.test(map.id || "") ? "river" : "lake";
  if (ch === ".") return /village|harbor|galaxy|town/.test(map.id || "") ? "cobble" : "gravel";
  if (ch === "~") return "gravel";
  if (ch === '"') return "grass";
  if (ch === "M") return "cliff";
  if (ch === "m" || ch === "H") return "wall";
  if (ch === "d" || ch === "u") return "wood";
  if ([",","F","T","R","=","S","s"].includes(ch)) return map.kind === "cave" ? null : "meadow";
  return null;
}

export function drawTerrain(ctx, ch, map, dx, dy, size, tx, ty) {
  if (!terrain.complete || !terrain.naturalWidth || map.kind === "in" || map.kind === "cave") return false;
  const name = terrainName(ch, map);
  if (!name) return false;
  const [cx,cy] = CELLS[name];
  const cw = terrain.naturalWidth / 4, chh = terrain.naturalHeight / 4;
  const inset = Math.max(4, Math.floor(Math.min(cw,chh) * .018));
  ctx.imageSmoothingEnabled = false;
  const regionW=cw-inset*2, regionH=chh-inset*2;
  const sw=regionW/3, sh=regionH/3;
  const gx=((tx%3)+3)%3, gy=((ty%3)+3)%3;
  ctx.drawImage(terrain, cx*cw+inset+gx*sw, cy*chh+inset+gy*sh, sw+.5, sh+.5, Math.round(dx), Math.round(dy), size+1, size+1);
  // 同じ地面が盤面状に見えないよう、座標に応じたごく薄い光と影を重ねる。
  const v = ((tx*17 + ty*31 + tx*ty) >>> 0) % 7;
  if (v === 0) { ctx.fillStyle="rgba(255,238,184,.055)"; ctx.fillRect(dx,dy,size,size); }
  else if (v === 1) { ctx.fillStyle="rgba(13,49,48,.045)"; ctx.fillRect(dx,dy,size,size); }
  return true;
}

function buildHeroFrame(dir, step) {
  if (!hero.complete || !hero.naturalWidth) return null;
  const key=dir+":"+step;
  if (heroFrames.has(key)) return heroFrames.get(key);
  const col={down:0,left:1,right:2,up:3}[dir] ?? 0;
  const row=step;
  const cw=Math.floor(hero.naturalWidth/4), ch=Math.floor(hero.naturalHeight/3);
  const src=document.createElement("canvas"); src.width=cw; src.height=ch;
  const sc=src.getContext("2d",{willReadFrequently:true}); sc.drawImage(hero,col*cw,row*ch,cw,ch,0,0,cw,ch);
  const data=sc.getImageData(0,0,cw,ch);
  let minX=cw,minY=ch,maxX=0,maxY=0;
  for(let y=0;y<ch;y++) for(let x=0;x<cw;x++) {
    const i=(y*cw+x)*4,r=data.data[i],g=data.data[i+1],b=data.data[i+2];
    const mag=r>110&&b>110&&g<Math.max(r,b)*.72;
    const gutter=r>248&&g>248&&b>248;
    if(mag||gutter) data.data[i+3]=0;
    else if(data.data[i+3]) { minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y); }
  }
  sc.putImageData(data,0,0);
  const out=document.createElement("canvas"); out.width=32; out.height=48;
  const oc=out.getContext("2d"); oc.imageSmoothingEnabled=false;
  const bw=Math.max(1,maxX-minX+1), bh=Math.max(1,maxY-minY+1);
  const scale=Math.min(30/bw,46/bh), dw=Math.max(1,Math.round(bw*scale)), dh=Math.max(1,Math.round(bh*scale));
  oc.drawImage(src,minX,minY,bw,bh,Math.floor((32-dw)/2),48-dh,dw,dh);
  heroFrames.set(key,out); return out;
}

export function drawHero(ctx, dir, moving, tick, x, y) {
  const row = moving ? (Math.floor(tick/150)%2 ? 0 : 2) : 1;
  const f=buildHeroFrame(dir,row);
  if(!f) return false;
  ctx.imageSmoothingEnabled=false;
  ctx.drawImage(f,Math.round(x),Math.round(y));
  return true;
}

export function drawTitleBackground(ctx,w,h) {
  if(!title.complete || !title.naturalWidth) return false;
  const want=w/h, have=title.naturalWidth/title.naturalHeight;
  let sx=0,sy=0,sw=title.naturalWidth,sh=title.naturalHeight;
  if(have>want){sw=sh*want;sx=(title.naturalWidth-sw)/2}else{sh=sw/want;sy=(title.naturalHeight-sh)/2}
  ctx.imageSmoothingEnabled=false;
  ctx.drawImage(title,sx,sy,sw,sh,0,0,w,h);
  const grad=ctx.createLinearGradient(0,0,0,150);
  grad.addColorStop(0,"rgba(4,18,51,.72)");grad.addColorStop(.68,"rgba(4,18,51,.12)");grad.addColorStop(1,"rgba(4,18,51,0)");
  ctx.fillStyle=grad;ctx.fillRect(0,0,w,170);
  return true;
}