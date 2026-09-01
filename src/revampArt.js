const TERRAIN_SRC = "../assets/revamp-v2/terrain-source.png";
const HERO_SRC = "../assets/revamp-v2/hero-source.png";
const OBJECT_SRC = "../assets/revamp-v2/objects-source.png";
const TITLE_SRC = "../assets/revamp/title-alpine.png";

function image(src) {
  const im = new Image();
  im.decoding = "async";
  im.src = new URL(src, import.meta.url).href;
  return im;
}
const terrain = image(TERRAIN_SRC);
const hero = image(HERO_SRC);
const objects = image(OBJECT_SRC);
const title = image(TITLE_SRC);
const heroFrames = new Map();
const terrainTextures = new Map();
const objectFrames = new Map();

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
  if (ch === "F") return "flowers";
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
  const texture = terrainTexture(name);
  if (!texture) return false;
  const sx = mod(tx * size, texture.width), sy = mod(ty * size, texture.height);
  drawWrapped(ctx, texture, sx, sy, size, Math.round(dx), Math.round(dy));
  // 同じ地面が盤面状に見えないよう、座標に応じたごく薄い光と影を重ねる。
  const v = ((tx*17 + ty*31 + tx*ty) >>> 0) % 7;
  if (v === 0) { ctx.fillStyle="rgba(255,238,184,.055)"; ctx.fillRect(dx,dy,size,size); }
  else if (v === 1) { ctx.fillStyle="rgba(13,49,48,.045)"; ctx.fillRect(dx,dy,size,size); }
  return true;
}

function mod(n,m){ return ((n%m)+m)%m; }

// 同種の地面は共通テクスチャ上の連続座標を読み、マス境界の線をなくす。
function terrainTexture(name) {
  if (terrainTextures.has(name)) return terrainTextures.get(name);
  if (!terrain.complete || !terrain.naturalWidth) return null;
  const [cx,cy]=CELLS[name], cw=terrain.naturalWidth/4, ch=terrain.naturalHeight/4;
  const src=document.createElement("canvas"); src.width=64; src.height=64;
  const c=src.getContext("2d"); c.imageSmoothingEnabled=true;
  const inset=Math.floor(Math.min(cw,ch)*.14), sw=cw-inset*2, sh=ch-inset*2;
  c.drawImage(terrain,cx*cw+inset,cy*ch+inset,sw,sh,0,0,64,64);
  const out=document.createElement("canvas"); out.width=128; out.height=128;
  const o=out.getContext("2d"); o.imageSmoothingEnabled=false;
  o.drawImage(src,0,0,64,64,0,0,64,64);
  o.save();o.translate(128,0);o.scale(-1,1);o.drawImage(src,0,0,64,64);o.restore();
  o.save();o.translate(0,128);o.scale(1,-1);o.drawImage(src,0,0,64,64);o.restore();
  o.save();o.translate(128,128);o.scale(-1,-1);o.drawImage(src,0,0,64,64);o.restore();
  terrainTextures.set(name,out); return out;
}

function drawWrapped(ctx,img,sx,sy,size,dx,dy){
  ctx.imageSmoothingEnabled=false;
  const w=Math.min(size,img.width-sx), h=Math.min(size,img.height-sy);
  ctx.drawImage(img,sx,sy,w,h,dx,dy,w,h);
  if(w<size) ctx.drawImage(img,0,sy,size-w,h,dx+w,dy,size-w,h);
  if(h<size) ctx.drawImage(img,sx,0,w,size-h,dx,dy+h,w,size-h);
  if(w<size&&h<size) ctx.drawImage(img,0,0,size-w,size-h,dx+w,dy+h,size-w,size-h);
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

const OBJECT_CELLS={
  alpineCabin:[0,0],alpineLodge:[1,0],alpineBoathouse:[2,0],alpineWorkshop:[3,0],
  alpineHerbalist:[0,1],alpineSnowChalet:[1,1],alpineRailStation:[2,1],alpineObservatory:[3,1],
  alpineFir:[0,2],alpineFirCluster:[1,2],alpineWoodBridge:[2,2],alpineCliff:[3,2],
};

function objectFrame(name){
  if(objectFrames.has(name)) return objectFrames.get(name);
  if(!objects.complete||!objects.naturalWidth||!OBJECT_CELLS[name]) return null;
  const [col,row]=OBJECT_CELLS[name],cw=Math.floor(objects.naturalWidth/4),ch=Math.floor(objects.naturalHeight/3);
  const out=document.createElement("canvas");out.width=cw;out.height=ch;
  const c=out.getContext("2d",{willReadFrequently:true});c.drawImage(objects,col*cw,row*ch,cw,ch,0,0,cw,ch);
  const d=c.getImageData(0,0,cw,ch);
  for(let i=0;i<d.data.length;i+=4){const r=d.data[i],g=d.data[i+1],b=d.data[i+2];if(r>120&&b>120&&g<Math.max(r,b)*.78)d.data[i+3]=0;}
  c.putImageData(d,0,0);objectFrames.set(name,out);return out;
}

export function drawRevampObject(ctx,name,x,y,w,h){
  const f=objectFrame(name);if(!f)return false;
  ctx.imageSmoothingEnabled=false;ctx.drawImage(f,Math.round(x),Math.round(y),Math.round(w),Math.round(h));return true;
}

export function drawRevampTree(ctx,x,y,w=54,h=70){
  return drawRevampObject(ctx,"alpineFir",x-w/2+16,y-h+32,w,h);
}

export function drawTileDetail(ctx,ch,x,y,size){
  if(ch==="R") return drawRevampObject(ctx,"alpineCliff",x-2,y-8,size+4,size+10);
  if(ch!=="="&&ch!=="S"&&ch!=="s") return false;
  ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.lineCap="round";
  if(ch==="="){
    ctx.fillStyle="rgba(18,34,38,.28)";ctx.fillRect(1,size-8,size-2,6);
    ctx.strokeStyle="#50351f";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(5,8);ctx.lineTo(5,size);ctx.moveTo(size-5,8);ctx.lineTo(size-5,size);ctx.stroke();
    ctx.strokeStyle="#b8874b";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(2,12);ctx.lineTo(size-2,12);ctx.moveTo(2,23);ctx.lineTo(size-2,23);ctx.stroke();
    ctx.strokeStyle="#efd195";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(3,10);ctx.lineTo(size-3,10);ctx.stroke();
  }else{
    ctx.fillStyle="rgba(18,34,38,.25)";ctx.beginPath();ctx.ellipse(size/2,size-3,10,4,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#5b3922";ctx.fillRect(size/2-2,13,4,17);
    ctx.fillStyle="#c79552";ctx.strokeStyle="#4b301f";ctx.lineWidth=2;ctx.fillRect(5,4,size-10,15);ctx.strokeRect(5,4,size-10,15);
  }
  ctx.restore();return true;
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
