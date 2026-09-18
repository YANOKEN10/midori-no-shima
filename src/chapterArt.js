import {drawNature73} from './natureArt73.js';
import {drawGarden72} from './gardenArt72.js';
import {asset as frontierAsset72} from './frontierArt.js';
import {drawEditorGround72,editorGroundReady72} from './editorGround72.js';
import {alpineReady65,drawAlpineProp65} from './alpineArt65.js';
import {drawForest61,drawJungleFeet61} from './jungleArt61.js';
const cottage=new Image();cottage.src=new URL('../assets/house-v60/chalet.png',import.meta.url).href;
import {drawSign,signReady} from './signArt.js';
import {drawRoad,roadReady,roadStyle} from './roadArt.js';
import {environmentReady,environmentProp,paintEnvironment,coastTile} from './decorArt.js';
import {drawFrontierMap,frontierGrass} from './frontierArt.js';
import {drawVoyageTile} from './voyageArt.js';
import {drawIndustrialTile} from './powerArt.js';
import {drawMarineAsset,drawMarineTile,marineReady,marineForest} from './marineArt.js';
import {grassReady,drawBiomeGrass} from './grassArt.js';
import {mountainReady,mountainMaterial,mountainFloor,mountainForest,mountainTrail} from './mountainArt.js';
import {forestCanopy,forestReady,boundaryTree} from './forestArt.js';
import {paintInterior,drawFurniture72} from './interiorArt.js';
// Tile-based rendering of the new material pack. The source atlas is preserved.
import { tileFor } from './tiles.js';
import * as G from './gfx.js';
const atlasImage=new Image();atlasImage.src=new URL('../assets/world-v5/swiss-atlas-v1.png',import.meta.url).href;
let atlas=null;fetch(new URL('../assets/world-v5/atlas.json',import.meta.url)).then(r=>r.json()).then(d=>{atlas=d;}).catch(e=>console.error('Tile atlas:',e));
const cache=new WeakMap();
export function drawMaterial(ctx,key,x,y,w,h){if(key==='sign')return drawSign(ctx,x,y,w,h);if(key==='chalet'&&cottage.complete&&cottage.naturalWidth){ctx.imageSmoothingEnabled=false;ctx.drawImage(cottage,x,y,w,h);return true;}const s=atlas?.sprites[key];if(!s||!atlasImage.complete||!atlasImage.naturalWidth)return false;ctx.imageSmoothingEnabled=false;ctx.drawImage(atlasImage,...s.rect,x,y,w,h);return true;}
function ground(ctx,id,x,y){if(!drawMaterial(ctx,id,x,y,32,32)){ctx.fillStyle='#75c7a2';ctx.fillRect(x,y,32,32);}}
// Rural tracks keep the grass texture; connected neighbours share open edges.
function landscape(c,map,x,y,ch){
 const wild=['mountain','natureforest','mossSanctuary'].includes(map.id)||['lake','ancient'].includes(map.biome);
 const rural=['village','rods','route1','route2'].includes(map.id);
 if(!wild&&!rural)return false;
 ground(c,'grass',x*32,y*32);
 if(!map.alpineRoute65&&(map.id==='mountain'||['lake','ancient'].includes(map.biome)))mountainFloor(c,x*32,y*32);
 if((wild||map.explorationDesign)&&ch==='.') {mountainTrail(c,map,x,y);return true;}
 if(ch!=='.'||wild)return true;
 const track=(a,b)=>{const t=map.rows[b]?.[a];return t==='.'||t==='D'||t==='S'&&map.signs.some(s=>s.x===a&&s.y===b&&s.ground==='.');};
 const dx=x*32,dy=y*32;
 const l=track(x-1,y)?0:3,r=track(x+1,y)?32:29,t=track(x,y-1)?0:3,b=track(x,y+1)?32:29;
 c.fillStyle='rgba(174,224,157,.36)';c.fillRect(dx+l,dy+t,r-l,b-t);
 const il=l?l+1:0,ir=r<32?r-1:32,it=t?t+1:0,ib=b<32?b-1:32;
 c.fillStyle='rgba(192,232,176,.20)';c.fillRect(dx+il,dy+it,ir-il,ib-it);
 for(let i=0;i<5;i++){const px=5+(x*7+y*3+i*11)%22,py=5+(x*3+y*13+i*7)%22;c.fillStyle=i%2?'#a1d29b':'#83c593';c.fillRect(dx+px,dy+py,2,1);}
 return true;
}
// Vertical walls use a continuous side rim and staggered rock seams.
function cliff(c,map,x,y){
 const w=map.rows[0].length,dx=x*32,dy=y*32;
 if(x!==0&&x!==w-1){drawMaterial(c,'cliff',dx,dy,32,32);return;}
 c.save();c.beginPath();c.rect(dx,dy,32,32);c.clip();c.translate(dx,dy);if(x===0){c.translate(32,0);c.scale(-1,1);}
 c.fillStyle=map.townDesign?'#64766b':'#624735';c.fillRect(0,0,32,32);
 for(let row=-1;row<3;row++)for(let col=0;col<3;col++){
  const px=5+col*11+(row%2?4:0),py=row*16+((y%2)*7);
  c.fillStyle=map.townDesign?'#96a28e':'#9b7650';c.fillRect(px,py,9,14);
  c.fillStyle=map.townDesign?'#bac2a8':'#bd9462';c.fillRect(px+1,py+1,4,9);
  c.fillStyle=map.townDesign?'#788677':'#78563d';c.fillRect(px+6,py+6,2,7);
 }
 c.fillStyle='#245f3a';c.fillRect(0,0,6,32);c.fillStyle='#53a653';c.fillRect(0,0,4,32);
 for(let py=0;py<32;py+=8){c.fillStyle='#81c766';c.fillRect(0,py,3,5);c.fillStyle='#377e42';c.fillRect(3,py+3,3,4);}
 c.restore();
}
function drawChapterBase72(ctx,map,camX,camY){
 if(!signReady()||!cottage.complete||!cottage.naturalWidth){ctx.fillStyle='#172d36';ctx.fillRect(0,0,G.W,G.H);return true;}
 if(drawForest61(ctx,map,camX,camY,drawMaterial))return true;
 if(drawFrontierMap(ctx,map,camX,camY,drawMaterial))return true;
 if(!atlas||!atlasImage.complete||!atlasImage.naturalWidth){ctx.fillStyle='#76c6a1';ctx.fillRect(0,0,G.W,G.H);return true;}
 let cv=cache.get(map);
 if(!cv){cv=document.createElement('canvas');cv.width=map.rows[0].length*32;cv.height=map.rows.length*32;const c=cv.getContext('2d');c.imageSmoothingEnabled=false;
 for(let y=0;y<map.rows.length;y++)for(let x=0;x<map.rows[y].length;x++){
 const ch=map.rows[y][x],dx=x*32,dy=y*32;
 if(map.kind==='in'){
  if(map.shipRoom){drawVoyageTile(c,map,x,y,ch);if(ch==='S')drawMaterial(c,'sign',dx,dy,32,32);continue;}
  if(map.biome==='industrial'){drawIndustrialTile(c,x,y,ch);if(ch==='S')drawMaterial(c,'sign',dx,dy,32,32);continue;}
  c.fillStyle='#c79b65';c.fillRect(dx,dy,32,32);c.fillStyle='#b48a58';c.fillRect(dx,dy+30,32,2);c.fillRect(dx+(y%2?15:0),dy,1,32);
  if(ch==='X'){c.fillStyle='#6e7879';c.fillRect(dx,dy,32,32);c.fillStyle='#bdc7ba';c.fillRect(dx+1,dy+1,30,24);}
  if(ch==='x'){c.fillStyle='#8c514c';c.fillRect(dx,dy,32,32);c.fillStyle='#deb577';c.fillRect(dx+2,dy+3,28,3);}
  continue;
 }
 if(map.kind==='cave'){
  const colors=map.theme==='volcano'?['#5a3d38','#6e4a3a']:map.theme==='shadow'?['#252d40','#343c55']:['#4a4356','#60556c'];
  c.fillStyle=colors[0];c.fillRect(dx,dy,32,32);c.fillStyle=colors[1];
  if(map.theme==='ruins'){c.fillRect(dx+2,dy+3,27,1);c.fillRect(dx+4,dy+6,1,19);c.fillRect(dx+18,dy+24,9,2);}
  else{const n=(x*17+y*31)%23;c.fillRect(dx+3+n%6,dy+5+n%9,7,2);c.fillRect(dx+8+n%7,dy+6+n%9,2,6);c.fillRect(dx+21,dy+22,3,2);c.fillRect(dx+5,dy+26,2,1);}
  if(ch==='X'||ch==='R'){
   if(map.maze61){
    const ruin=map.theme==='ruins',solid=(xx,yy)=>['R','X'].includes(map.rows[yy]?.[xx]);
    c.fillStyle=ruin?'#6b6878':'#344252';c.fillRect(dx,dy,32,32);
    c.fillStyle=ruin?'#858293':'#435267';
    for(let yy=0;yy<32;yy+=16){c.fillRect(dx+1,dy+yy+1,30,2);c.fillRect(dx+((y*2+yy/16)%2?8:23),dy+yy+3,1,12);}
    if(!solid(x,y+1)){c.fillStyle=ruin?'#343342':'#19232f';c.fillRect(dx,dy+21,32,11);c.fillStyle=ruin?'#a09aab':'#647083';c.fillRect(dx,dy+20,32,2);}
    if(!solid(x-1,y)){c.fillStyle='#242d36';c.fillRect(dx,dy,2,32);}
    if(!solid(x+1,y)){c.fillStyle='#242d36';c.fillRect(dx+30,dy,2,32);}
   }else drawMaterial(c,'rock',dx,dy,32,32);
  }
  if(ch==='S')drawMaterial(c,'sign',dx,dy,32,32);
  if(ch==='W'){c.fillStyle='#a52f1c';c.fillRect(dx,dy,32,32);c.fillStyle='#ffb347';c.fillRect(dx+2,dy+8,19,3);c.fillRect(dx+12,dy+23,18,3);}
  if(ch==='.')ground(c,'path',dx,dy);
  continue;
 }
 const groundCh=ch==='S'?(map.signs.find(s=>s.x===x&&s.y===y)?.ground||','):ch;
 const base=groundCh==='.'?'path':ch==='W'?'river':ch==='H'||ch==='h'?'path':'grass';if(!['grass','path'].includes(base)||!landscape(c,map,x,y,groundCh))ground(c,base,dx,dy);
 if(drawMarineTile(c,map,x,y,ch)){if(!(map.alpineRoute65&&ch==='d'))drawRoad(c,map,x,y);continue;}
 if(groundCh==='.'&&roadStyle(map)){ground(c,'grass',dx,dy);drawRoad(c,map,x,y);}
 
 if(ch==='"'&&!drawBiomeGrass(c,map,dx,dy))ground(c,'tallGrass',dx,dy);
 if(ch==='F'&&!map.powerArt)drawMaterial(c,'flowers',dx+3,dy+3,26,26);
 if(ch==='R'){if(map.biome){if(!(map.props||[]).some(p=>x>=p.x&&x<p.x+p.w&&y>=p.y&&y<p.y+p.h))drawMarineAsset(c,'shoreRock',dx,dy,32,32);}else if(map.id==='mountain'){if(!(map.props||[]).some(p=>p.art==='mountainCrag'&&x>=p.x&&x<p.x+p.w&&y>=p.y&&y<p.y+p.h))mountainMaterial(c,'rock',dx,dy,32,32);}else drawMaterial(c,'rock',dx,dy,32,32);}
 if(ch==='X')cliff(c,map,x,y);
 if(ch==='S')drawMaterial(c,'sign',dx,dy,32,32);
 if(ch==='='){const side=(map.daycarePens||[]).some(p=>(x===p.x||x===p.x+p.w-1)&&y>p.y&&y<p.y+p.h-1);drawMaterial(c,side?'fenceVertical':'fenceHorizontal',dx,dy,32,32);}
 if(ch==='d'){c.fillStyle='#99754b';c.fillRect(dx,dy,32,32);for(let j=0;j<32;j+=8){c.fillStyle='#d8b67c';c.fillRect(dx+2,dy+j,28,5);}}
 if(ch==='H')drawMaterial(c,'stairs',dx,dy,32,32);
 if(ch==='h'){c.fillStyle='#503f2c';c.fillRect(dx+5,dy,4,32);c.fillRect(dx+23,dy,4,32);for(let j=3;j<32;j+=8){c.fillStyle='#d4ae70';c.fillRect(dx+5,dy+j,22,4);}}
 }
 for(let y=0;y<map.rows.length;y++)for(let x=0;x<map.rows[y].length;x++)coastTile(c,map,x,y,map.rows[y][x]);
 paintEnvironment(c,map,drawMaterial);
 if(map.kind==='in'){
 const visited=new Set();for(let y=0;y<map.rows.length;y++)for(let x=0;x<map.rows[y].length;x++){
 const ch=map.rows[y][x];if(!'bBtKP'.includes(ch)||visited.has(x+','+y))continue;let w=1,h=1;while(map.rows[y][x+w]===ch)w++;while(map.rows[y+h]?.slice(x,x+w)===ch.repeat(w))h++;
 for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)visited.add(i+','+j);c.drawImage(tileFor(ch,0,null,255,0,0,x,y),x*32,y*32,w*32,h*32);
 }}
 if(map.biome)marineForest(c,map);else if(map.id==='mountain')mountainForest(c,map);else forestCanopy(c,map);
 drawEditorGround72(c,map,drawMaterial);
 for(const p of map.props||[]){if(drawAlpineProp65(c,p,map,drawMaterial))continue;if(p.fashionShop){drawMaterial(c,p.art,p.x*32,p.y*32,p.w*32,p.h*32);continue;}if(environmentProp(c,p,map))continue;if(map.sailingPort&&p.art==='ferry')continue;if(boundaryTree(map,p))continue;if(map.townDesign&&['tree','fir'].includes(p.art)){if(map.biome==='flowers')drawMarineAsset(c,'flowerTree',p.x*32,p.y*32,p.w*32,p.h*32);else drawMaterial(c,p.art,p.x*32,p.y*32,p.w*32,p.h*32);continue;}if(map.biome&&drawMarineAsset(c,['tree','fir'].includes(p.art)?'ancientTree':p.art,p.x*32,p.y*32,p.w*32,p.h*32)){}else if(map.id==='mountain'&&['tree','fir','mountainCrag'].includes(p.art))mountainMaterial(c,p.art==='mountainCrag'?'crag':p.art,p.x*32,p.y*32,p.w*32,p.h*32);else drawMaterial(c,p.art,p.x*32,p.y*32,p.w*32,p.h*32);}
 if(map.room)paintInterior(c,map);
 if(alpineReady65(map)&&roadReady(map)&&environmentReady(map)&&(!map.forestBorder||forestReady())&&(map.id!=='mountain'||mountainReady())&&grassReady(map)&&(!(map.biome||map.townPond)||marineReady()))editorGroundReady72(map)&&cache.set(map,cv);}
 ctx.fillStyle=map.kind==='in'?'#6e7879':'#75c7a2';ctx.fillRect(0,0,G.W,G.H);
 ctx.drawImage(cv,Math.round(-camX),Math.round(-camY));return true;
}
export function drawGrassFeet(ctx,map,px,py,camX,camY){

 const left=px,top=py+8,right=px+32,bottom=py+20;
 for(let y=Math.floor(top/32);y<=Math.floor((bottom-1)/32);y++)for(let x=Math.floor(left/32);x<=Math.floor((right-1)/32);x++){
 if(map.rows[y]?.[x]!=='"')continue;ctx.save();ctx.beginPath();ctx.rect(left-camX,top-camY,32,12);ctx.clip();if(!drawEditorGrassFeet73(ctx,map,x,y,camX,camY)&&!drawJungleFeet61(ctx,map,x*32-camX,y*32-camY)&&!frontierGrass(ctx,map,x,y,x*32-camX,y*32-camY)&&!drawBiomeGrass(ctx,map,x*32-camX,y*32-camY,x*32,y*32))drawMaterial(ctx,'tallGrass',x*32-camX,y*32-camY,32,32);ctx.restore();}
}
const battleImages={};
export function drawChapterBattle(ctx,terrain){const key=terrain==='river'?'river':'grass';let im=battleImages[key];if(!im){im=battleImages[key]=new Image();im.src=new URL('../assets/world-v5/battle-'+key+'-simple-v2.png',import.meta.url).href;}if(!im.complete||!im.naturalWidth)return false;
 // Background and two platform strips are placed separately to match sprite feet.
 ctx.imageSmoothingEnabled=false;
 ctx.drawImage(im,0,0,im.width,Math.floor(im.height*.4),0,0,320,196);
 if(key==='grass'){
 ctx.drawImage(im,850,425,650,168,180,112,136,35);
 ctx.drawImage(im,0,830,1060,194,-5,171,154,28);
 }else{
 ctx.drawImage(im,620,335,860,217,177,110,145,37);
 ctx.drawImage(im,0,700,1080,324,-3,164,160,48);
 }return true;}

function drawEditorGrassFeet73(c,map,x,y,camX,camY){const p=map.editorAddedProps72?.find(p=>p.walkable&&(p.group==='grass'||p.tile==='\"')&&x>=p.x&&x<p.x+p.w&&y>=p.y&&y<p.y+p.h);return p?drawNature73(c,p.art,p.x*32-camX,p.y*32-camY,p.w*32,p.h*32):false;}
export function drawEditorProp72(c,p,map){if(p.art==='mountainCrag'){mountainMaterial(c,'crag',p.x*32,p.y*32,p.w*32,p.h*32);return true;}if(p.art==='shopCounter'){drawFurniture72(c,{theme:'home'},[['counter',p.x,p.y,p.w,p.h]]);return true;}if(drawNature73(c,p.art,p.x*32,p.y*32,p.w*32,p.h*32))return true;if(drawGarden72(c,p))return true;if(frontierAsset72(c,p.art,p.x*32,p.y*32,p.w*32,p.h*32))return true;if(environmentProp(c,p,map))return true;if(drawAlpineProp65(c,p,{...map,alpineRoute65:true},drawMaterial))return true;if(drawMarineAsset(c,p.art,p.x*32,p.y*32,p.w*32,p.h*32))return true;return drawMaterial(c,p.art,p.x*32,p.y*32,p.w*32,p.h*32);}
const editorViews73=new WeakMap();
export function drawChapterMap(c,map,camX,camY){let view=map;if(map.editorVisualRows73){view=editorViews73.get(map);if(!view){view={...map,rows:map.editorVisualRows73};editorViews73.set(map,view);}}const result=drawChapterBase72(c,view,camX,camY);c.save();c.translate(-camX,-camY);for(const p of map.editorAddedProps72||[])drawEditorProp72(c,p,map);if(map.editorAddedFurniture72?.length)drawFurniture72(c,{theme:'home'},map.editorAddedFurniture72);for(const f of map.editorStyledFurniture73||[])drawFurniture72(c,f.room,[f.f]);c.restore();return result;}
